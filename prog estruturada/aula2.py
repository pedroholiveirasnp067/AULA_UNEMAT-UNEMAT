v_total = float(input('Digite o valor total da compra: '))
cupom = input('possui cupom:')
desconto = 0

if cupom == 'sim':
    if v_total > 200:
        desconto = v_total * 0.15
    elif v_total > 100:
        desconto = v_total * 0.1
    else:
        desconto = 0

    desconto += v_total * 0.05

else:
    if v_total > 200:
        desconto = v_total * 0.15
    elif v_total > 100:
        desconto = v_total * 0.1
    else:
        desconto = 0

print(f'o valor do desconto é: {desconto:.2f}')
print(f'O valor total da compra com desconto é: {v_total - desconto:.2f}')
