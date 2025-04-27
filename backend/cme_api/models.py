from django.db import models
from django.db.models import TextChoices
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.utils import timezone

# Create your models here.

User = get_user_model()

class Category(models.Model):
    type = models.CharField(max_length=255)
    descricao = models.TextField()

    def __str__(self):
        return self.type


class Product(models.Model):
    nome = models.CharField(max_length=255)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="category_products")
    
    @property
    def get_codigo_prefixo(self):
        return self.nome[:4].upper()

    
class ProductSerial(models.Model):
    produto = models.ForeignKey("Product", on_delete=models.CASCADE, related_name="serials_products")
    codigo_serial = models.CharField(max_length=100, unique=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.codigo_serial:
            prefixo = self.produto.get_codigo_prefixo()
            self.codigo_serial = f"{prefixo}001"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.codigo_serial
    
    class Meta:
        ordering = ["-criado_em"]
        verbose_name = "Serial do Produto"
        verbose_name_plural = "Seriais dos Produtos"
        

class Receiving(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_receiving")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_receiving")
    entry_data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
   
    
class Distribution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_distribution")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_distribution")
    entry_data = models.DateTimeField(auto_now_add=True)
    sector = models.CharField(max_length=50, default="NO DISTRIBUTION")
    
    def __str__(self):
        return self.user.username
   
    
class Washing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_washing")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_washing")
    entry_data = models.DateTimeField(auto_now_add=True)
    isWashed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username


class ProcessHistory(models.Model):
    
    class EtapaChoices(TextChoices):
        RECEIVING = "RECEIVING", "Receiving"
        DISTRIBUTION = "DISTRIBUTION", "Distribution"
        WASHING = "WASHING", "Washing"
        DISCARDED = "DISCARDED", "Discarded"
    
    serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_process_history")
    etapa = models.CharField(
        max_length=50,
        choices=EtapaChoices.choices,
        default="NO PROCESS"
        )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="User_process_history")
    entry_data = models.DateTimeField(auto_now_add=True)
    receiving = models.ForeignKey("Receiving", on_delete=models.CASCADE, related_name="receiving_process_history", null=True, blank=True)
    distribution = models.ForeignKey("Distribution", on_delete=models.CASCADE, related_name="distribution_process_history", null=True, blank=True)
    washing = models.ForeignKey("Washing", on_delete=models.CASCADE, related_name="washing_process_history", null=True, blank=True)

    def __str__(self):
        return f"{self.serial.codigo_serial} - {self.user.username} - {self.etapa}"