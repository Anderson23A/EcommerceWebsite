# Generated by Django 5.2 on 2025-04-12 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produtos', '0005_alter_produtomodel_imagem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produtomodel',
            name='imagem',
            field=models.ImageField(default='', upload_to='imagensProdutos'),
        ),
    ]
