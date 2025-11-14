from rest_framework import serializers
from .models import ONG, Animal, ConsultaVeterinaria, Adotante

# --- ONGSerializer (Sem Alterações) ---
class ONGSerializer(serializers.ModelSerializer):
    class Meta:
        model = ONG
        fields = ['id', 'nome', 'endereco', 'contato', 'created_at']

# ----------------------------------------
# --- AnimalSerializer (CORRIGIDO) ---
class AnimalSerializer(serializers.ModelSerializer):
    # Campos de Leitura (read_only) para o Frontend exibir
    # Estes campos são úteis ao LISTAR/DETALHAR, mas ignorados ao CRIAR/EDITAR
    ong_nome = serializers.CharField(source="ong.nome", read_only=True)
    adotante_nome = serializers.CharField(source="adotante.nome", read_only=True, allow_null=True)

    class Meta:
        model = Animal
        
        fields = [
            'id',
            'nome',
            'idade',
            'especie',
            'adotado',
            'ong', 
            'ong_nome',
            'adotante', 
            'adotante_nome', 
        ]
        
        extra_kwargs = {
            'adotante': {'required': False, 'allow_null': True}
        }
        
# --- ConsultaVeterinariaSerializer (CORRIGIDO) ---
class ConsultaVeterinariaSerializer(serializers.ModelSerializer):
    # O campo de leitura permanece animal_nome, mas deve usar 'animal' como source
    animal_nome = serializers.CharField(source="animal.nome", read_only=True)
    
    # Adiciona um campo de escrita que mapeia 'animal_id' no payload para o campo 'animal' no Model
    animal_id = serializers.PrimaryKeyRelatedField(
        source='animal',  # Mapeia o valor recebido em 'animal_id' para a chave estrangeira 'animal' do Model
        queryset=Animal.objects.all(),
        write_only=True  # Opcional: Garante que ele só é usado na escrita (POST/PUT)
    )

    class Meta:
        model = ConsultaVeterinaria
        fields = [
            'id',
            'data',
            'veterinario',
            'observacoes',
            'animal_id',
            'animal_nome' 
        ]
        
class AdotanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adotante
        fields = [
            'id',
            'nome',
            'cpf',
            'endereco',
            'email',
            'telefone',
            'created_at'
        ]