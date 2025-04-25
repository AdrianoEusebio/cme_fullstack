from django.db import models
from django.db.models import TextChoices

# Create your models here.

class Category(models.Model):
    type = models.CharField(max_length=255)
    descricao = models.TextField()

    def __str__(self):
        return self.type

#//

class Product(models.Model):
    nome = models.CharField(max_length=255)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="category_products")

    def get_codigo_prefixo(self):
        base = slugify(self.nome).upper().replace("-", "") # type: ignore
        return (base[:4] + 'X' * 4)[:4]

#//
    
class ProductSerial(models.Model):
    produto = models.ForeignKey("Product", on_delete=models.CASCADE, related_name="serials_products")
    codigo_serial = models.CharField(max_length=100, unique=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self,*args,**kwargs):
       is_new = self.pk is None
       super().save(*args, **kwargs)
       if is_new:
           prefixo = self.produto.get_codigo_prefixo()
           serial = f"{prefixo}{self.pk:04d}"
           self.codigo_serial = serial
           ProductSerial.objects.filter(pk=self.pk).update(codigo_serial=self.codigo_serial)
    
    def __str__(self):
        return self.codigo_serial
    
    class Meta:
        ordering = ["-criado_em"]
        verbose_name = "Serial do Produto"
        verbose_name_plural = "Seriais dos Produtos"
 
 #//
    
class UserGroup(models.Model):
    group_desc = models.CharField(max_length=200)
    permission1 = models.BooleanField(default=False)
    permission2 = models.BooleanField(default=False)
    permission3 = models.BooleanField(default=False)

    def __str__(self):
        return self.group_desc
    
#//

class User(models.Model):
    usernome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user_group = models.ForeignKey("UserGroup", on_delete=models.CASCADE, related_name="users_group")

    def __str__(self):
        return self.usernome

#//

class Receiving(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_receiving")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_receiving")
    entry_data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
   
#//   
    
class Distribution(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_distribution")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_distribution")
    entry_data = models.DateTimeField(auto_now_add=True)
    sector = models.CharField(max_length=50, default="NO DISTRIBUTION")
    
    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
   
#//
    
class Washing(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_washing")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_washing")
    entry_data = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="WASHING")
    
    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
    
#//   
     
class EtapaChoices(TextChoices):
    RECEIVING = "RECEIVING", "Receiving"
    DISTRIBUTION = "DISTRIBUTION", "Distribution"
    NO_WASHING = "NO WASHING", "No Washing"
    WASHING = "WASHING", "Washing"
    DISCARDED = "DISCARDED", "Discarded"

#//

class ProcessHistory(models.Model):
    serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="entry_process_history")
    etapa = models.CharField(
        max_length=50,
        choices=EtapaChoices.choices,
        default="NO PROCESS"
        )

    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_process_history")
    entry_data = models.DateTimeField(auto_now_add=True)
    receiving = models.ForeignKey("Receiving", on_delete=models.CASCADE, related_name="receiving_process_history", null=True, blank=True)
    distribution = models.ForeignKey("Distribution", on_delete=models.CASCADE, related_name="distribution_process_history", null=True, blank=True)
    washing = models.ForeignKey("Washing", on_delete=models.CASCADE, related_name="washing_process_history", null=True, blank=True)

    def __str__(self):
        return f"{self.serial.codigo_serial} - {self.user.usernome} - {self.etapa}"