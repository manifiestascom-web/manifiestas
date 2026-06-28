import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret || stripeSecret === 'sk_test_mockkey') {
      return NextResponse.json({ 
        error: 'STRIPE_SECRET_KEY no está configurada o tiene el valor por defecto. Por favor actualiza tu archivo .env.local.' 
      }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16' as any,
    });

    const body = await req.json().catch(() => ({}));
    const planType: 'monthly' | 'yearly' | 'test' = body?.planType || 'monthly';
    const testEventCode = body?.testEventCode || '';

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    let lineItems: any[] = [];

    if (planType === 'test') {
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Acceso de Prueba Premium (1 USD)',
              description: 'Acceso de prueba a Manifiestas Pro',
            },
            unit_amount: 100, // 100 centavos = $1.00 USD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    } else {
      const priceId = planType === 'yearly' 
        ? process.env.STRIPE_PRICE_ID_YEARLY 
        : process.env.STRIPE_PRICE_ID;

      if (!priceId || priceId === 'price_mockid' || priceId === 'price_mockyearlyid') {
        return NextResponse.json({ 
          error: `${planType === 'yearly' ? 'STRIPE_PRICE_ID_YEARLY' : 'STRIPE_PRICE_ID'} no está configurada en .env.local.` 
        }, { status: 400 });
      }

      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
    }

    const successRedirect = testEventCode 
      ? `${origin}/app?checkout=success&test_event_code=${encodeURIComponent(testEventCode)}`
      : `${origin}/app?checkout=success`;

    // Crear la sesión de checkout en Stripe para la suscripción seleccionada
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: lineItems,
      mode: 'subscription',
      success_url: successRedirect,
      cancel_url: `${origin}/paywall?checkout=cancel`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error al crear sesión de checkout:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
