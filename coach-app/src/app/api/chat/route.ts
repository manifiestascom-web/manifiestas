import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("CRÍTICO: OPENAI_API_KEY no está definida en las variables de entorno.");
      return new NextResponse('Error de configuración: falta OPENAI_API_KEY en el servidor', { status: 500 });
    }

    const supabase = await createClient();
    
    // 1. Validar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    // 2. Cargar perfil para verificar el plan (free/pro)
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const isPro = profile?.subscription_tier === 'pro';

    // 3. Si es FREE, validar que no exceda el límite de 5 mensajes hoy
    if (!isPro) {
      const today = new Date().toISOString().split('T')[0];
      
      const { count, error: countErr } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('sender', 'user')
        .gte('created_at', today);

      if (countErr) throw countErr;

      if (count !== null && count >= 3) {
        return new NextResponse('Límite de mensajes diarios alcanzado (3/3). Actualiza a Pro para mensajes ilimitados.', { status: 403 });
      }
    }

    // 4. Leer los mensajes enviados por el cliente
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse('Petición incorrecta', { status: 400 });
    }

    // El último mensaje de la lista es el que acaba de enviar el usuario
    const lastUserMessage = messages[messages.length - 1];

    // Obtener el texto del mensaje del usuario de forma compatible con Vercel AI SDK v6
    let userText = lastUserMessage.content || '';
    if (!userText && lastUserMessage.parts && Array.isArray(lastUserMessage.parts)) {
      userText = lastUserMessage.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }

    // Guardar el mensaje del usuario en Supabase antes de llamar a ChatGPT mini
    const { error: saveUserErr } = await supabase
      .from('chat_messages')
      .insert({
        text: userText,
        sender: 'user',
        user_id: user.id
      });

    if (saveUserErr) throw saveUserErr;

    // 5. Configurar el prompt de sistema del Coach de Manifestación
    const systemPrompt = `Eres un mentor y guía espiritual de manifestación de alto nivel. Hablas desde la experiencia, la sabiduría cuántica y una profunda empatía humana.

REGLAS DE COMPORTAMIENTO (CRÍTICAS PARA NO PARECER UN ROBOT):
- NO actúes como un asistente virtual clásico. Nunca uses frases corporativas, introducciones robóticas como "¡Entiendo!" o "¡Claro, con gusto te ayudo!", ni resúmenes repetitivos.
- Responde directamente al grano con una profunda perspectiva intuitiva, como un sabio que lee el alma de la persona detrás de la pantalla.
- Tu tono debe ser cálido, místico, sumamente consciente y cercano (como un mensaje de voz directo de un guía que te conoce de años).
- Mantén tus respuestas breves, máximo 2 o 3 oraciones de alto impacto. Que cada palabra tenga un peso espiritual real.
- Termina SIEMPRE con UNA sola pregunta directa y reflexiva que confronte al usuario con su propio poder creador o sus miedos ocultos.
- Evita las listas, explicaciones estructuradas paso a paso, y el exceso de emojis (máximo 1 emoji sutil si realmente aporta calidez).

TU ESENCIA Y FILOSOFÍA:
- La manifestación no es pedir cosas al universo, es convertirte en la vibración de lo que deseas y despejar los bloqueos subconscientes.
- Ayudas al usuario a identificar sus miedos, autosabotajes y creencias limitantes sobre el dinero, amor, salud y éxito.
- Comunícate siempre en un español natural y fluido, transmitiendo paz, claridad y certeza cuántica.`;


    // Convertir el historial de mensajes al formato de CoreMessage del SDK de IA
    const formattedMessages = await convertToModelMessages(messages);

    // 6. Generar el stream de texto con ChatGPT mini (gpt-4o-mini)
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: formattedMessages,
      onFinish: async (response) => {
        // Guardar la respuesta de la IA en Supabase cuando finalice el stream
        await supabase
          .from('chat_messages')
          .insert({
            text: response.text,
            sender: 'ai',
            user_id: user.id
          });
      }
    });

    // 7. Retornar el stream en formato compatible con useChat
    return result.toTextStreamResponse();

  } catch (err: any) {
    console.error("Error en API de Chat:", err);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
