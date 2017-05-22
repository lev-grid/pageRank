const fs = require('fs');

var readFile = fileName => {
	var str = fs.readFileSync(fileName, 'utf8').split('\r\n');
	var lin = {}, lout = {}, tap = {}, ap = [];
	for (let i = 0; i < str.length; ++i) {
		var pages = str[i].split('\t');
		if (!lin[pages[1]]) lin[pages[1]] = [];
		lin[pages[1]].push(pages[0]);
		if (!lout[pages[0]]) lout[pages[0]] = [];
		lout[pages[0]].push(pages[1]);
		tap[pages[0]] = true;
		tap[pages[1]] = true;
	}
	ap = Object.keys(tap);
	return { 'ap': ap, 'lin': lin, 'lout': lout};
}

var calc = (obj1, obj2) => {
	var sum = 0;
	for (let i in obj1) sum += Math.abs(obj1[i]-obj2[i]);
	return sum;
}

var cutTop = (mass, n) => {
	var max = new Array(n);
	for (let i = 0; i < n; ++i) max[i] = [0, 0];
	for (let i in mass) {
		for (let o = 0; o < n; ++o) {
			if (!max[o] || mass[i]>max[o][1]) {
				for (let p = n-1; p > o; --p) {
					max[p][0] = max[p-1][0];
					max[p][1] = max[p-1][1];
				}
				max[o][0] = i
				max[o][1] = mass[i];
				break;
			}
		}
	}
	return max;
}

var checkSum = (obj1, obj2) => calc(obj1, obj2) > 1e-8;
var pageRank = data => {
	var osh = [];
	for (let m = 0; m < 3; ++m) {
		var pr = {}, opr ={};
		var d = 0.85, itr = 0;
		var co = data.ap.length;
		for (let i = 0; i < co; ++i) {
			var tmp = data.lin[data.ap[i]];
			pr[data.ap[i]] = tmp ? 1-d+d*tmp.length/co : 1-d;
			opr[data.ap[i]] = 0;
		}
		osh[m] = [];
		while (checkSum(opr, pr)) {
			itr++;
			console.log(`# ${m+1} # ${itr} #`);
			Object.assign(opr, pr);
			for (let i = 0; i < co; ++i) {
				var u = data.ap[i];
				pr[u] = 1-d;
				if (data.lin[u]) {
					for (let j = 0; j < data.lin[u].length; ++j) {
						var v = data.lin[u][j];
						// Power-Iteration
						if (m == 0) {
							pr[u] += opr[v]*d/data.lout[v].length;
						}
						// Gauss-Zeidel
						if (m == 1) {
							pr[u] += pr[v]*d/data.lout[v].length;
						}
						// Modification
						if (m == 2) {
							pr[u] += (1-d)*d/(data.lout[v].length);
							if (data.lin[v]) {
								for (let o = 0; o < data.lin[v].length; ++o) {
									var w = data.lin[v][o];
									var coof = w == u ? opr[w] : pr[w];
									pr[u] += coof*(d*d)/(data.lout[w].length*data.lout[v].length);
								}
							}
						}
					}
				}
			}
			osh[m].push(calc(opr, pr));
		}
	}
	var rasm = osh.map(o => o.length).reduce((m, c) => Math.max(m, c));
	var text = '';
	for (let i = 0; i < rasm; ++i) {
		text += osh.reduce((s, c) => s+' '+(c[i] ? c[i] : 0), `${i+1}`)+'\n';
	}
	fs.writeFileSync('ergebnisse/erg3.txt', text.slice(0, -1));
	return pr;
}

var file1 = 'Test', file2 = 'Stanford', file3 = 'Google';
const data = readFile(`daten/web-${file3}.txt`);
console.log("################");
const pr = pageRank(data);
console.log("################");
console.log(cutTop(pr, 8));