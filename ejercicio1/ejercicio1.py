def esPerfecto(n):
    sum=0
    for i in range(1,n/2+1):
        if n%i==0:
            sum=sum+i
    if sum==n:
        print n,' es un numero perfecto.'
    else:
        if sum>n:
            print n,' es un numero abundante.'
        else:
            print n,' es un numero defectivo.'
