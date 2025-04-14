import { useEffect } from 'react'
import { CheckMarkIconSVG } from '../../assets/svgs'
import './sucesso.scss'

export default function SucessoPagina(){
    useEffect(()=>{
        setTimeout(()=>{
            window.location.href = '/'
        }, 1200)
    },[])
    return (
        <div className='sucesso-pagina'>
            <div className='bloco'>
                <div className='containerSVG'>
                    <CheckMarkIconSVG/>
                </div>
                <p>Compra realizada com sucesso !!!</p>
            </div>
        </div>
    )
}