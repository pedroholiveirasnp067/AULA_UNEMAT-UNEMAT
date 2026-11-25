"""
Sistema de cálculo de médias e situação acadêmicade alunos.

Autores:
	- Pedro Henrique de Oliveira
	
Disciplina:
	- Programação Estruturada"""

from pathlib import Path
lista_infos = []

def calcular_media(nota1, nota2):
	"""Calcula a média aritimética de duas notas
	e a retorna

	Args:
		nota1 (float): A primeira nota.
		nota2 (float): A segunda nota.

	Returns:
		float: a média aritimética dos valores.
	"""

	return (nota1 + nota2) / 2

def separarDados(string, separador=';'):
	"""Separa uma string por meio se um separador padrão,
	ou por um separador passado na chamada da função e retorna
	uma lista com os valores divididos.

	Args:
		string (str): O texto a ser separado.
		separador (str, optional): O valor usado para separar a string.

	Returns:
		list: Uma lista com as strings separadas.
	"""

	return string.split(separador)

def definir_situacao(media, media_corte=7):
	"""Compara uma média e verifica sua situação em relação a um valor de corte.

	Args:
		media (float): Média a ser comparada.
		media_corte (int, optional): Valor de corte para tomar uma decisão.

	Returns:
		str: Um texto indicando a situação do estudante.
	"""

	if media >= media_corte:
		return 'Aprovado'
	else:
		return 'Reprovado'

def coleta_caminho():
	"""Coleta o caminho do arquivo e verifica se ele existe.

	Returns:
		Path: O caminho do arquivo.

	Raises:
		FileNotFoundError: Caso o arquivo não exista.
	"""

	caminho = Path().resolve()
	if not caminho.exists():
		raise FileNotFoundError
	return caminho

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
	if not verif_nome_arquivo(arquivo_entrada):
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
		return False

	else:
		arquivo_entrada = str(coleta_caminho()) + '\\' + arquivo_entrada
		with open(arquivo_entrada, 'r', encoding='utf-8') as file:
			for lin in file.readlines():
				try:
					if lin.strip():
						dados = separarDados(lin)
						media = calcular_media(float(dados[1]), float(dados[2]))
						situacao = definir_situacao(media)
						lista_infos.append([dados[0], media, situacao])
				except:
					print(f'Erro ao processar a linha: {lin}')
					lista_infos.append([dados[0], 0.0, 'erro ao processar a linha'])

		return True

def salvar_arquivo(arquivo_saida):
	"""Salva os dados processados em um arquivo de saída.
	
	Args:
		arquivo_saida (str): O nome do arquivo de saída.

	Returns:
		bool: True se os dados forem salvos com sucesso, False caso contrário.
	"""

	global lista_infos
	arquivo_saida = str(coleta_caminho()) + '\\' + arquivo_saida
	try:
		with open(arquivo_saida, 'w', encoding='utf-8') as f:
			for inf in lista_infos:
				f.write(f'{inf[0]};{inf[1]:.1f};{inf[2]}\n')
		return True
	except:
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