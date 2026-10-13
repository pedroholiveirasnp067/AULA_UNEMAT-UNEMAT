from random import shuffle

lista = [e for e in range(0,20,2)]

print(lista)

lista_invertida = reversed(lista)
print(list(lista_invertida))

lista_embaralhada = lista
shuffle(lista_embaralhada)

print(lista_embaralhada)

for e in lista_embaralhada:
    x = 0
    while x < len(lista_embaralhada)-1:
        if lista_embaralhada[x] > lista_embaralhada[x+1]:
            lista_embaralhada[x], lista_embaralhada[x+1] = lista_embaralhada[x+1], lista_embaralhada[x]
        x += 1
print(lista_embaralhada)