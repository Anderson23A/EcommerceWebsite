import './produtos.scss'
import LaptopIMG from '../../assets/heroSection.png'
import { FiltroSVG, LupaSVG } from '../../assets/svgs'
import Dropdown from 'react-bootstrap/Dropdown'
import servidor from '../../server/server'
import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Produto(props){
    const detalhes = props.detalhes
    let [real, centavos] = String(detalhes.preco).split('.')
    if (real.length >= 4){
        real = `${String(real.slice(0,1))}.${String(real.slice(1))}`
    }
    const preco = `${real}${(centavos === undefined)?',00':','+String(centavos).padEnd('2','0')}`
    
    return (
        <div className='produto' onClick={()=>{
            window.location.href = `/produto/${detalhes.id}/`
        }}>
            <div className='img-container'>
                <img src={detalhes['imagem']} alt="" />
            </div>
            <div className='detalhes'>
                <div className='nome-container'>
                    <p className='nome'>{detalhes['nome']}</p>
                </div>
                <p className='descricao'>{detalhes['descricao']}</p>
                <p className='preco'>R$ {preco}</p>
            </div>
        </div>
    )
}
export default function ProdutosPagina() {
    const [produtos, setProdutos] = useState([])
    const load_data = async()=>{
        const res_data = (await servidor.get('/produtos/'))['data']
        setProdutos(res_data)
    }
    const render_produtos = ()=>{
        const produtosLista = []
        const qLinhas = parseInt(produtos.length / 3)
        const restoItems = parseInt(produtos.length % 3)
        let itemIndex = 0
        for (let i=0; i < qLinhas; i+=1){
            const linha = []
            const produtos0 = [
                produtos[itemIndex],
                produtos[itemIndex+1],
                produtos[itemIndex+2],
            ]
            for (let pI=0; pI < produtos0.length; pI+=1){
                linha.push(
                    <Col lg key={linha.length}>
                        <Produto detalhes={produtos0[pI]}/>
                    </Col>
                )
            }
            produtosLista.push(
                <Row lg key={produtosLista.length}>{linha}</Row>
            )
            itemIndex += 3
        }
        const restoLinha = []
        for (let i=0; i < restoItems; i+=1){
            let produtoI = produtos[i+itemIndex]
            restoLinha.push(
                <Col lg key={restoLinha.length}>
                    <Produto detalhes={produtoI}/>
                </Col>
            )
        }
        while (restoLinha.length !== 3){
            restoLinha.push(
                <Col lg key={restoLinha.length}>

                </Col>
            )
        }
        produtosLista.push(
            <Row lg key={produtosLista.length}>
                {restoLinha}
            </Row>
        )
        return (
            <Container>
                {produtosLista}
            </Container>
        )
    }
    useEffect(()=>{
        load_data()
    },[])
    return (
        <div className="produtosPagina">
            <section id="hero-section">
                <div className='background'>
                    <div className='IMGContainer'>
                        <img src={LaptopIMG} alt="" />
                    </div>
                    <div className='rect'></div>
                </div>
                <div className='content'>
                    <h1>Produtos</h1>
                </div>
            </section>
            <section id='produtos-section'>
                <div className='ferramenta-barra'>
                    <div className='filtro'>
                        <button>
                            <FiltroSVG />
                        </button>
                    </div>
                    <div style={{padding: '5px'}}></div>
                    <div className='pesquisa'>
                        <input />
                        <LupaSVG/>
                    </div>
                    <div className='categoria'>
                        <Dropdown>
                            <Dropdown.Toggle id='dropdown-basic'>
                                Mais Vendidos
                            </Dropdown.Toggle>
                        </Dropdown>
                    </div>
                </div>
                <div className='produtos'>
                    {render_produtos()}
                </div>
            </section>
        </div>
    )
}