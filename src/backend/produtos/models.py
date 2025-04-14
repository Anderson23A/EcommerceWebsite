from django.db import models

# Create your models here.
class ProdutoModel(models.Model):
    nome = models.CharField(default='', max_length=255)
    preco = models.FloatField(default=10.0, max_length=255)
    descricao = models.TextField(default='')
    avaliacao = models.IntegerField(default=1)
    imagem = models.ImageField(upload_to='imagensProdutos', default='')