# Generated by Django 5.2 on 2025-04-12 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProdutoModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(default='', max_length=255)),
                ('preco', models.CharField(default='10.0', max_length=255)),
                ('descricao', models.TextField(default='')),
                ('avalicao', models.TextField(default='')),
            ],
        ),
    ]
