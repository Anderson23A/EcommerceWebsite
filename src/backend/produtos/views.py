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

        # for i in range(5):
        #     newObj = ProdutoModel.objects.create(
        #         imagem=rf'imagensProdutos\cpu.png'
        #     )
        #     newObj.nome = f'produto-{newObj.id}'
        #     newObj.preco = 540.05
        #     newObj.descricao = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer '
        #     newObj.save()
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
