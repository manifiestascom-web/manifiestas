import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(request: Request) {
  try {
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

    // Guardar el mensaje del usuario en Supabase antes de llamar a Gemini
    const { error: saveUserErr } = await supabase
      .from('chat_messages')
      .insert({
        text: userText,
        sender: 'user',
        user_id: user.id
      });

    if (saveUserErr) throw saveUserErr;

    // 5. Configurar el prompt de sistema del Mentor de Hábitos Atómicos
    const systemPrompt = `Eres "Hábitos", un mentor de comportamiento y hábitos de alta vibración (inspirado en la metodología de Hábitos Atómicos de James Clear).

REGLAS DE FORMATO (OBLIGATORIAS):
- Responde SIEMPRE en máximo 2-3 oraciones cortas y poderosas. Nunca más.
- Usa un tono de motivación racional, empático y directo (como un amigo sabio e inteligente).
- Termina SIEMPRE con UNA sola pregunta de autorreflexión para mantener la disciplina y el enfoque del usuario.
- Usa emojis con moderación (máximo 1-2 por mensaje).
- NO hagas listas, NO escribas párrafos largos, NO des explicaciones extensas.

TU ESENCIA:
- Ayudas a los usuarios a estructurar hábitos diarios, identificar disparadores (señales), y simplificar respuestas para evitar la procrastinación.
- Si el usuario dice que tiene pereza o rompió una racha, recuérdale con empatía que "nunca rompa dos veces seguidas" (el segundo error es el inicio de un nuevo mal hábito).
- Comunícate siempre en español.`;


    // Convertir el historial de mensajes al formato de CoreMessage del SDK de IA
    const formattedMessages = await convertToModelMessages(messages);

    // 6. Generar el stream de texto con Gemini 2.5 Flash
    const result = await streamText({
      model: google('gemini-2.5-flash'),
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
