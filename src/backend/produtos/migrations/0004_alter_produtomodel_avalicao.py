# Generated by Django 5.2 on 2025-04-12 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produtos', '0003_alter_produtomodel_preco'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produtomodel',
            name='avalicao',
            field=models.IntegerField(default=''),
        ),
    ]
