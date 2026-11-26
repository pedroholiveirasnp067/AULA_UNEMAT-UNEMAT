"""
Sistema de cálculo de médias e situação acadêmicade alunos.

Autores:
	- Pedro Henrique de Oliveira
	
Disciplina:
	- Programação Estruturada
"""

from pathlib import Path
lista_infos = []

def calcular_media(nota1, nota2):
	"""Calcula a média aritmética de duas notas e a retorna.

	Args:
		nota1 (float): A primeira nota.
		nota2 (float): A segunda nota.

	Returns:
		float: a média aritmética dos valores.
	"""

	return (nota1 + nota2) / 2

def separarDados(string, separador=';'):
	"""Divide uma string utilizando um separador padrão ou 
	um separador especificado na chamada da função e retorna 
	uma lista com os valores resultantes.

	Args:
		string (str): O texto a ser separado.
		separador (str, optional): O valor usado para separar a string.

	Returns:
		list: Uma lista com as strings separadas.
	"""

	return string.split(separador)

def definir_situacao(media):
	"""Compara uma média e verifica sua situação em relação a um valor de corte.

	Args:
		media (float): Média a ser comparada.

	Returns:
		str: Um texto indicando a situação do estudante.
	"""

	if media >= 7.0:
		return 'Aprovado'
	else:
		return 'Reprovado'

def coleta_caminho():
    """Retorna o caminho do diretório atual.

    Returns:
        Path: Caminho do diretório atual.
    """
    return Path.cwd()

def verif_nome_arquivo(nome_arquivo):
	"""Verifica se o nome do arquivo é válido.

	Args:
		nome_arquivo (str): O nome do arquivo a ser verificado.

	Returns:
		bool: True se o nome do arquivo for válido, False caso contrário.
	"""

	if not nome_arquivo.endswith('.txt'):
		return False
	return True

def carregar_arquivo(arquivo_entrada):
	"""Carrega os dados de um arquivo de entrada e os armazena em uma lista global.
	
	Args:
		arquivo_entrada (str): O nome do arquivo de entrada.

	Returns:
		bool: True se os dados forem carregados com sucesso, False caso contrário.
	"""

	global lista_infos
	lista_infos.clear()

	if not verif_nome_arquivo(arquivo_entrada):
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
		return False

	else:
		arquivo_entrada = coleta_caminho() / arquivo_entrada

		with open(arquivo_entrada, 'r', encoding='utf-8') as file:
			for lin in file.readlines():
				dados = []
				
				try:
					if lin.strip():
						dados = separarDados(lin.strip())

						if len(dados) != 3:
							raise ValueError
						
						media = calcular_media(float(dados[1]), float(dados[2]))
						situacao = definir_situacao(media)

						lista_infos.append([dados[0], media, situacao])

				except (ValueError, IndexError):
					print(f'Erro ao processar a linha: {lin}')
					nome = dados[0] if 'dados' in locals() and dados else 'Linha inválida'

					lista_infos.append([nome, 0.0, 'erro ao processar a linha'])

		return True

def salvar_arquivo(arquivo_saida):
	"""Salva os dados processados em um arquivo de saída.
	
	Args:
		arquivo_saida (str): O nome do arquivo de saída.

	Returns:
		bool: True se os dados forem salvos com sucesso, False caso contrário.
	"""

	global lista_infos
	arquivo_saida = coleta_caminho() / arquivo_saida
	try:
		with open(arquivo_saida, 'w', encoding='utf-8') as f:
			for inf in lista_infos:
				f.write(f'{inf[0]};{inf[1]:.1f};{inf[2]}\n')
		return True
	except OSError:
		return False
		

if __name__ == '__main__':
	try:
		while True:
			arquivo_entrada = input('Digite o nome do arquivo de entrada: ')
			verificacao = carregar_arquivo(arquivo_entrada)
			if not verificacao:
				continue

			arquivo_saida = 'resultado_final.txt'
			verif = salvar_arquivo(arquivo_saida)
			print(f'Arquivo {arquivo_saida} foi salvo com sucesso!') if verif else print('Erro ao salvar o arquivo de saída.')
			break
			
	except FileNotFoundError:
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
	except:
		print('Ocorreu um erro inesperado. Tente novamente.')