import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Validar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Leer parámetros del cuerpo (deseo, emoción, acción)
    const { desire, emotion, action } = await request.json();
    if (!desire || !emotion || !action) {
      return NextResponse.json({ error: 'El deseo, la emoción y la acción son requeridos' }, { status: 400 });
    }

    // 3. Verificar tier de suscripción y límite diario para free
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const isPro = profile?.subscription_tier === 'pro';

    if (!isPro) {
      const today = new Date().toISOString().split('T')[0];
      const { count, error: countErr } = await supabase
        .from('manifestation_triangles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      if (countErr) throw countErr;

      if (count !== null && count >= 1) {
        return NextResponse.json({ error: 'Has alcanzado tu límite diario de 1 triángulo. Actualiza a Pro para generar ilimitados.' }, { status: 403 });
      }
    }

    // 3. Crear el Prompt para Gemini
    const prompt = `Actúa como un coach de reprogramación cuántica y manifestación de alta vibración.
El usuario ha completado los tres vértices de su Triángulo de Manifestación:
- Vértice Deseo: "${desire}"
- Vértice Emoción: "${emotion}"
- Vértice Acción: "${action}"

Genera una afirmación cuántica de poder sumamente personalizada, vibrante y alineada. Debe unir de forma fluida el Deseo (lo que se quiere manifestar), la Emoción (el sentimiento del deseo ya cumplido) y la Acción física y práctica (el paso concreto que dará hoy).
La afirmación debe ser en primera persona del presente ("Yo soy...", "Estoy...", "Elijo...", etc.), corta (máximo 2 oraciones) y de gran impacto emocional.

Ejemplo:
Deseo: "Tener ingresos de 10.000 USD al mes"
Emoción: "Libre, seguro y agradecido"
Acción: "Lanzar una nueva campaña para conseguir clientes"
Respuesta: "Estoy manifestando abundancia financiera ilimitada y disfruto de una vida completamente libre, segura y agradecida. Hoy tomo la acción inspirada de lanzar mi campaña, sabiendo que el universo me respalda."

Devuelve únicamente la afirmación generada en formato de texto plano, sin comillas ni explicaciones adicionales.`;

    // 4. Llamar a Gemini 2.5 Flash
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    });

    const cleanAffirmation = text.replace(/^"|"$/g, '').trim();

    return NextResponse.json({ affirmation: cleanAffirmation });

  } catch (err: any) {
    console.error("Error en API de generación de triángulo:", err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
