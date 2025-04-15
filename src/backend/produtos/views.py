from .models import ProdutoModel
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from dotenv import load_dotenv
import os
from stripe import StripeClient
import math

load_dotenv()


client = StripeClient(os.getenv("STRIPE_SECRET_KEY"))


# Create your views here.
class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoModel
        fields = "__all__"


class ProdutoView(viewsets.ModelViewSet):
    queryset = ProdutoModel.objects.all()
    serializer_class = ProdutoSerializer

    def list(self, request):
        # ProdutoModel.objects.all().delete()

        # if len(ProdutoModel.objects.all()) <= 0:
        #     produtos = [
        #         {
        #             "nome": "Laptop TechPro X15",
        #             "descricao": 'Notebook com tela Full HD de 15,6", processador Intel Core i7 de 12ª geração, 16 GB de RAM e SSD de 512 GB. Ideal para trabalho, estudos e entretenimento.',
        #             "preco": 4299.00,
        #             "avaliacao": 5,
        #             "imagem": r"imagensProdutos\Laptop TechPro X15.png",
        #         },
        #         {
        #             "nome": "Mouse Óptico SpeedClick M200",
        #             "descricao": "Mouse com sensor óptico de alta precisão, design ergonômico e conexão USB. Compatível com Windows, Mac e Linux.",
        #             "preco": 59.90,
        #             "avaliacao": 4,
        #             "imagem": r"imagensProdutos\Mouse Óptico SpeedClick M200.png",
        #         },
        #         {
        #             "nome": "HD Externo DataStore 2TB USB 3.0",
        #             "descricao": " Disco rígido externo com 2 TB de capacidade, interface USB 3.0 e compatibilidade com diversos sistemas operacionais. Ideal para backup e armazenamento de grandes volumes de dados.",
        #             "preco": 389.90,
        #             "avaliacao": 4,
        #             "imagem": r"imagensProdutos\HD Externo DataStore 2TB USB 3.0.png",
        #         },
        #         {
        #             "nome": "SSD Raptor X 1TB NVMe",
        #             "descricao": "Unidade de estado sólido com 1 TB de armazenamento, tecnologia NVMe para alta velocidade de leitura e gravação. Recomendado para games e aplicações pesadas.",
        #             "preco": 679.00,
        #             "avaliacao": 4,
        #             "imagem": r"imagensProdutos\SSD Raptor X 1TB NVMe.png",
        #         },
        #         {
        #             "nome": "Teclado Mecânico IronKeys MK-500",
        #             "descricao": "Teclado mecânico com iluminação RGB, switches azuis e estrutura reforçada em metal. Indicado para digitação intensa e jogos.",
        #             "preco": 299.00,
        #             "avaliacao": 4,
        #             "imagem": r"imagensProdutos\Teclado Mecânico IronKeys MK-500.png",
        #         },
        #     ]
        #     for i, produto in enumerate(produtos):
        #         newObj = ProdutoModel.objects.create(imagem=produto["imagem"])
        #         newObj.nome = produto["nome"]
        #         newObj.preco = produto["preco"]
        #         newObj.descricao = produto["descricao"]
        #         newObj.avaliacao = produto["avaliacao"]
        #         newObj.save()
        return super().list(request)

    @action(methods=["GET"], detail=False)
    def pegar_produto(self, request):
        produtoId = request.query_params["id"]
        produto = ProdutoModel.objects.get(id=produtoId)
        data = self.serializer_class(produto).data
        data["imagem"] = request.build_absolute_uri(produto.imagem.url)
        return Response(data)

    @action(methods=["GET", "POST"], detail=False)
    def criar_checkout(self, request):
        quantidade = request.data["quantidade"]
        try:
            quantidade = int(quantidade)
        except:
            quantidade = 1

        if quantidade <= 0:
            quantidade = 1

        produtoId = request.data["produtoId"]
        produto = ProdutoModel.objects.get(id=produtoId)
        preco = produto.preco
        # preco *= quantidade
        preco = preco * 100
        if (preco - int(preco)) >= 0.5:
            preco = math.ceil(preco)
        else:
            preco = math.floor(preco)

        try:
            checkout = client.checkout.sessions.create(
                {
                    "success_url": "http://localhost:8000/sucesso/",
                    "line_items": [
                        {
                            "price_data": {
                                "currency": "brl",
                                "unit_amount": preco,
                                "product_data": {
                                    "name": produto.nome,
                                    "images": [
                                        request.build_absolute_uri(produto.imagem.url),
                                    ],
                                },
                            },
                            "quantity": quantidade,
                        }
                    ],
                    "mode": "payment",
                }
            )
            data = {
                "checkoutId": checkout.id,
                "preco_total": preco / 100,
            }
        except Exception as e:
            print(e)
            return Response("")

        return Response(data)
