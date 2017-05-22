import matplotlib.pyplot as plot

data, it, pi, md, gz = [], [], [], [], []

f = open('ergebnisse/erg3.txt', 'r')
for line in f:
	res = line.strip().split(' ');
	it.append(res[0])
	pi.append(res[1])
	gz.append(res[2])
	md.append(res[3])

plot.plot(it, pi, label = u'Power Iteration')
plot.plot(it, gz, label = u'Gauss Seidel')
plot.plot(it, md, label = u'Modification')


plot.legend()
plot.grid(True)
plot.savefig('grafiken/graf3.png', dpi=200)
plot.show()