from django.contrib import admin
from .models import ONG, Animal, ConsultaVeterinaria, Adotante

@admin.register(ONG)
class ONGAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "endereco", "contato", "is_active", "created_at")
    search_fields = ("nome", "endereco")
    list_filter = ("is_active",)
    verbose_name = "ONG"
    verbose_name_plural = "ONGs"


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "especie", "idade", "adotado", "ong", "is_active")
    search_fields = ("nome", "especie")
    list_filter = ("adotado", "especie", "is_active")
    verbose_name = "Animal"
    verbose_name_plural = "Animais"


@admin.register(ConsultaVeterinaria)
class ConsultaVeterinariaAdmin(admin.ModelAdmin):
    list_display = ("id", "animal", "data", "veterinario", "is_active")
    search_fields = ("veterinario", "animal__nome")
    list_filter = ("data", "is_active")
    verbose_name = "Consulta Veterinária"
    verbose_name_plural = "Consultas Veterinárias"

@admin.register(Adotante)
class AdotanteAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "cpf", "endereco", "email", "telefone", "is_active", "created_at")
    search_fields = ("nome", "cpf", "email")
    list_filter = ("is_active",)
    verbose_name = "Adotante"
    verbose_name_plural = "Adotantes"