// api/criar-preferencia.js
const mercadopago = require("mercadopago");

module.exports = async (req, res) => {
  try {
    // Verifica variável de ambiente
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN não configurado no ambiente." });
    }

    mercadopago.configure({
      access_token: accessToken
    });

    // Caso queira customizar itens dinamicamente, aceite body com itens
    // Aqui deixei fixo para o seu caso (Livro R$55,00)
    const preference = {
      items: [
        {
          title: "Mil Vidas em Um Ano Só - Livro",
          quantity: 1,
          unit_price: 55.00,
        }
      ],
      back_urls: {
        success: "https://seusite.com/sucesso",
        failure: "https://seusite.com/falha",
        pending: "https://seusite.com/pendente"
      },
      auto_return: "approved"
    };

    const resposta = await mercadopago.preferences.create(preference);

    // Retorna init_point para redirecionar o cliente ao checkout Mercado Pago
    return res.status(200).json({
      init_point: resposta.body.init_point,
      sandbox_init_point: resposta.body.sandbox_init_point || null
    });
  } catch (err) {
    console.error("Erro criar-preferencia:", err);
    return res.status(500).json({ error: "Erro ao criar a preferência de pagamento." });
  }
};
