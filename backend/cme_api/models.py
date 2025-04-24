from django.db import models

# Create your models here.
class Product(models.Model):
    nome = models.CharField(max_length=255)

    def get_codigo_prefixo(self):
        base = slugify(self.nome).upper().replace("-", "") # type: ignore
        return (base[:4] + 'X' * 4)[:4]
    
class ProductSerial(models.Model):
    produto = models.ForeignKey("Product", on_delete=models.CASCADE, related_name="productos")
    codigo_serial = models.CharField(max_length=100, unique=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self,*args,**kwargs):
        if not self.codigo_serial:
            super().save(*args, **kwargs) 
            prefixo = self.produto.get_codigo_prefixo()
            self.codigo_serial = f"{prefixo}{str(self.id).zfill(4)}"
            self.save()
        else:
            super().save(*args, **kwargs)
    
    def __str__(self):
        return self.codigo_serial
    
    
    class UserGroup(models.Model):
        group_desc = models.CharField(max_length=200)

    def __str__(self):
        return self.nome
    

class User(models.Model):
    usernome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user_group = models.ForeignKey("UserGroup", on_delete=models.CASCADE, related_name="users")

    def __str__(self):
        return self.usernome

class Receiving(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="receiving")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="receiving")
    entry_data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
    
class Distribution(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="distribution")
    protudo_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="distribution")
    entry_data = models.DateTimeField(auto_now_add=True)
    sector = models.CharField(max_length=50, default="NO DISTRIBUTION")
    
    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
    
class Washing(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="washing")
    produto_serial = models.ForeignKey("ProductSerial", on_delete=models.CASCADE, related_name="washing")
    entry_data = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="WASHING")
    
    def __str__(self):
        return f"{self.produto_serial.codigo_serial} - {self.user.usernome}"
    

