const request = require("tinyreq");
const cheerio = require("cheerio");
const cheerioReq = require("cheerio-req");
var fs = require('fs');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

cheerioReq("http://www.minhavida.com.br/saude/temas", (err, $) => {
	let Completo=[]
	var links = $("ul.lista-letra li a");
	fs.unlink('teste.txt', function (err) {
	  if (err) throw err;
	  console.log('File deleted!');
	});
	gerarJson($(links))
		
});

function cadaUrl(link){
	cheerioReq(link, (errNew, $new) => {
		let Completo={
			nomes:Sinonimos($new),
			descrição:Descricao($new),
			link:link
		}
		fs.appendFile('teste.txt', JSON.stringify(Completo), function (err) {
		  if (err) throw err;
		  console.log(Completo.nomes,'ok!');
		});
	});
}
function Sinonimos($new){
	let nomes=[]
	if($new("article h1").text()){
		nomes.push($new("article h1").text().split(":")[0])
	}
	if($new("div#visao-geral div#11 p").text()){
		if($new("div#visao-geral div#11-collapse p")[0].children[0].data.match("Sinônimos")){
			nomes=nomes.concat($new("div#visao-geral div#11-collapse p")[0].children[0].data.replace("Sinônimos:","").replace(/[^a-záàâãéèêíïóôõöúçñ0-9\,\ ]+/ig,"").split(","))
			for (var i = nomes.length - 1; i >= 0; i--) {
				nomes[i]=nomes[i].replace(/^\s+|\s+$/,"").capitalize()
			}
		}
	}
	return(nomes)
}

function Descricao($new){
	return "descrição aqui"
}

function gerarJson(links,callback){
	let Completo=[]
 	links.each(function(i, link){
		Completo.push(cadaUrl("http://www.minhavida.com.br"+link.attribs.href))
	});	
}
