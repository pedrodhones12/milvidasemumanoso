export default async function handler(req, res) {

    const token = process.env.MELHOR_ENVIO_TOKEN;

    const { cep } = req.query;

    const payload = {
        from: { postal_code: "4589-000" },
        to: { postal_code: cep },
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

    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
        return res.status(400).json({ erro: true });
    }

    const frete = dados[0];

    res.status(200).json({
        transportadora: frete.company.name,
        preco: frete.price,
        prazo: frete.delivery_time
    });
}
