const { takeOrder, showOrder } = require("../functions");

const iniciarChat = (genAI, menu) => {
  return genAI
    .getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0,
      },
      systemInstruction: `Eres un asistente para un restaurante de Sushi. Cuando te pidan el menú debes mostrar el siguiente menu ${menu}
Puedes tomar pedidos/ordenes. Identifica si el mensaje del usuario es un pedido o no. Si es un pedido, crea la información vinculando el plato que eligió el usuario con el plato del menú en este formato estricto:
[{ "pedido": true, "Plato": "nombre del plato", "Cantidad": "cantidad de plato" }]
Reconoce si el usuario tiene intenciones de ver sus pedidos o ordenes , y muestraselos
Si no es un pedido, continúa contestando normalmente. Muestra el menú si te lo piden y responde preguntas frecuentes como: ¿Están abiertos? Nuestros horarios son de 9am a 14pm. 
No utilices la palabra 'pedido' para otra cosa que no sea un pedido real.

Solo permite preguntas sobre nuestro restaurante, cuando pregunten algo que no tenga que ver, muestra las opciones del menu`,
      tools: {
        functionDeclarations: [takeOrder, showOrder],
      },
    })
    .startChat();
};

module.exports = iniciarChat;
