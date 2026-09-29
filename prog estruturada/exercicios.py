# Pedro Henrique de Oliveira
#============================

# exercício 1:
#ano = int(input('Digite seu ano de nascimento: '))
#print(f'você tem {2026-ano} anos de idade')

n1 = float(input('digite o primeiro numero: '))
n2 = float(input('digite o segundo numero: '))
operacao = input('''
escolha uma operação (digite os numeros de 1 a 4):
1. soma
2. subtração
3. multiplicação
4. divisão

>>>''')

if operacao == '1':
    print(n1+n2)
elif operacao == '2':
    print(n1-n2)
elif operacao == '3':
    print(n1*n2)
elif operacao == '4':
    print(n1/n1)
else:
    print('ERRO: digite apenas uma das opções (números de 1 a 4)!')
