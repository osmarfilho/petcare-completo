from django.db import models
import uuid

class BaseManager(models.Manager):
    """Manager que retorna apenas objetos com is_active=True por padrão."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class BaseModel(models.Model):
    """Classe base abstrata para todos os modelos."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    objects = BaseManager() # Manager padrão (apenas ativos)
    all_objects = models.Manager() # Manager para todos (ativos e inativos)

    class Meta:
        abstract = True
        ordering = ['-created_at'] # Ordem padrão: mais novo primeiro

    def delete(self, using=None, keep_parents=False):
        """Sobrescreve o delete para realizar exclusão lógica (soft delete)."""
        self.is_active = False
        self.save()

class ONG(BaseModel):
    
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200)
    contato = models.CharField(max_length=50, blank=True) # Adicionando blank=True

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "ONG"
        verbose_name_plural = "ONGs"
        ordering = ['nome']

# Definição do Adotante antes de Animal para evitar string literal
class Adotante(BaseModel):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=200)
    email = models.EmailField(unique=True)  
    # Adicionado blank=True para tornar o preenchimento opcional no formulário
    telefone = models.CharField(max_length=20, blank=True) 

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Adotante"
        verbose_name_plural = "Adotantes"
        ordering = ['nome']


class Animal(BaseModel):
    ESPECIES_CHOICES = [
        ("cachorro", "Cachorro"),
        ("gato", "Gato"),
        ("outro", "Outro"),
    ]

    nome = models.CharField(max_length=100)
    idade = models.IntegerField(default=0) # Definindo um default para evitar problemas com 0
    especie = models.CharField(max_length=20, choices=ESPECIES_CHOICES, default="cachorro")
    adotado = models.BooleanField(default=False)
    
    # Relações
    ong = models.ForeignKey(ONG, on_delete=models.CASCADE, related_name="animais")

    adotante = models.ForeignKey(
        Adotante, # Usando a classe diretamente agora
        on_delete=models.SET_NULL,  
        null=True,              # Permite valores nulos no banco
        blank=True,             # Permite valores vazios no formulário
        related_name='animais'
    )

    def __str__(self):
        return f"{self.nome} ({self.especie})"
    
    class Meta:
        verbose_name = "Animal"
        verbose_name_plural = "Animais"
        ordering = ['nome']


class ConsultaVeterinaria(BaseModel):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="consultas")
    
    data = models.DateField() # Correção aplicada: Data, sem hora

    veterinario = models.CharField(max_length=100)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        # Certifique-se de que self.data seja uma data válida antes de formatar
        try:
            return f"Consulta de {self.animal.nome} em {self.data.strftime('%d/%m/%Y')}"
        except AttributeError:
            return f"Consulta de {self.animal.nome}"
    
    class Meta:
        verbose_name = "Consulta Veterinária"
        verbose_name_plural = "Consultas Veterinárias"
        ordering = ['-data']