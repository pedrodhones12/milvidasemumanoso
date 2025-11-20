
// /api/frete.js
export default async function handler(req, res) {
  try {
    const token = process.env.MELHOR_ENVIO_TOKEN;
    if (!token) {
      return res.status(500).json({ erro: true, mensagem: "Token não configurado no servidor." });
    }

    const { cep } = req.query;
    if (!cep) {
      return res.status(400).json({ erro: true, mensagem: "CEP de destino não informado." });
    }

    // ATENÇÃO: coloque aqui seu CEP de origem corretamente (8 dígitos, sem traço ou com traço)
    const cepRemetente = "45680000"; // <-- substitua pelo seu CEP real (ex: 45680000)

    const payload = {
      from: { postal_code: cepRemetente },
      to: { postal_code: cep.replace(/\D/g, "") }, // remove qualquer caractere
      package: {
        height: 4,
        width: 12,
        length: 16,
        weight: 0.400
      }
    };

    const resposta = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const status = resposta.status;
    const dados = await resposta.json();

    // repassa erro amigável
    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(400).json({ erro: true, mensagem: "Resposta inválida do Melhor Envio", detalhe: dados, status });
    }

    const frete = dados[0];
    return res.status(200).json({
      transportadora: frete.company?.name ?? "Desconhecida",
      preco: frete.price ?? 0,
      prazo: frete.delivery_time ?? "-"
    });
  } catch (err) {
    console.error("Erro no handler /api/frete:", err);
    return res.status(500).json({ erro: true, mensagem: "Erro interno no servidor", detalhe: err.message });
  }
}

