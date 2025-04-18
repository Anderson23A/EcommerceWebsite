import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import "./produto.scss";
import { SetaDireitaSVG, SetaEsquerdaSVG, EstrelaSVG } from "../../assets/svgs";
import { useEffect, useState } from "react";
import servidor from "../../server/server";
import { loadStripe } from "@stripe/stripe-js";

export default function ProdutoPagina() {
  const [produtoDetalhes, setProdutoDetalhes] = useState({});
  const [checkoutId, setcheckoutId] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [precoTotal, setPrecoTotal] = useState(0);
  const params = useParams();

  const carregar_dados = async () => {
    const res = await servidor.get("/produtos/pegar_produto/", {
      params: {
        id: params.produtoId,
        headers: { "Content-Type": "application/json" },
      },
    });
    const data = res["data"];
    let [real, centavos] = String(data.preco).split(".");
    if (real.length >= 4) {
      real = `${String(real.slice(0, 1))}.${String(real.slice(1))}`;
    }
    const preco = `${real}${
      centavos === undefined ? ",00" : "," + String(centavos).padEnd("2", "0")
    }`;
    setProdutoDetalhes({ ...data, precoSTR: preco });
  };
  const comprar_produto = async () => {
    const res = (
      await servidor.post(
        "/produtos/criar_checkout/",
        {
          quantidade: quantidade,
          produtoId: params.produtoId,
        },
        { headers: { "Content-Type": "application/json" } }
      )
    )["data"];
    const checkoutId_data = res["checkoutId"];
    const stripePromise = await loadStripe(
      "pk_test_51Ouudh00R55810eE4GI2TM9GAba1xLOBdIISXlIViD1cvmnTQ0Ujehgw9BSKkqUzm5LIwPGUtKIhrcHg78gb0z2Q00cj0WKX2G"
    );
    stripePromise.redirectToCheckout({
      sessionId: checkoutId_data,
    });
    // setPrecoTotal(res['preco_total'])
    // setcheckoutId(res['checkoutId'])
  };
  const render_avaliacao = () => {
    let avaliacoes = [];
    for (let i = 0; i < produtoDetalhes.avaliacao; i += 1) {
      avaliacoes.push(
        <div className={`estrela-${true}`} key={avaliacoes.length}>
          <EstrelaSVG />
        </div>
      );
    }
    while (avaliacoes.length < 5) {
      avaliacoes.push(
        <div className={`estrela-${false}`} key={avaliacoes.length}>
          <EstrelaSVG />
        </div>
      );
    }
    return avaliacoes;
  };
  useEffect(() => {
    carregar_dados();
  }, []);
  return (
    <div className="produto-pagina">
      <section id="produto-secao">
        <Container>
          <Row lg>
            <Col lg>
              <div className="produto-img">
                <img src={produtoDetalhes.imagem} alt="" />
              </div>
            </Col>
            <Col lg>
              <div className="produto-detalhes">
                <div className="detalhes">
                  <p className="produto-nome">{produtoDetalhes.nome}</p>
                  <p className="produto-descricao">
                    {produtoDetalhes.descricao}
                  </p>
                </div>
                <div className="quantidade">
                  <button
                    onClick={() => {
                      setQuantidade(quantidade - 1);
                    }}
                  >
                    <SetaEsquerdaSVG />
                  </button>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value))}
                  />
                  <button
                    onClick={() => {
                      setQuantidade(quantidade + 1);
                    }}
                  >
                    <SetaDireitaSVG />
                  </button>
                </div>
                <div className="preco">
                  <p>R$ {produtoDetalhes.precoSTR}</p>
                </div>
                <div className="avaliacao">{render_avaliacao()}</div>

                <div className="comprar-botao" onClick={comprar_produto}>
                  <button>Comprar</button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
