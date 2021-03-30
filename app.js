class Anotacao {
    constructor(titulo, descricao, hora, cor) {
        this.titulo = titulo,
        this.descricao = descricao,
        this.hora = hora,
        this.cor = cor
    }   
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id == null){
            localStorage.setItem('id', 0)
        }
    }

    novoId() {
        let proximoId = localStorage.getItem('id')
        return JSON.parse(proximoId) + 1
        
    }

    registrarNota(a) {
        let id = this.novoId()

        localStorage.setItem(id, JSON.stringify(a))

        localStorage.setItem('id', id)
    }

    recuperarRegistro() {
        let nota = Array()

        let id = localStorage.getItem('id')

        

        for(let i = 1; i <= id; i++) {
            let notas = JSON.parse(localStorage.getItem(i))
            
            if(notas == null) {
                continue
            }

            notas.id = i
            nota.push(notas)
        }
        
        return nota
    }

    removerNota(id) {
        localStorage.removeItem(id)
    }

    alterarValor(id, nota) {   
        localStorage.setItem(id, JSON.stringify(nota))
    }

    alterarOrdem(id, validar) {
        if(validar == 'pos'){
            let idAtual = localStorage.getItem(id)
            let idNext = localStorage.getItem(id + 1)

            if(idNext != null){
                localStorage.setItem(id, idNext)
                localStorage.setItem(id + 1, idAtual)
            } else {
                return
            }
            
        } else {
            
            let idAtual = localStorage.getItem(id)
            let idNext = localStorage.getItem(id - 1)

            if(idNext != null){
                localStorage.setItem(id, idNext)
                localStorage.setItem(id - 1, idAtual)
            } else {
                return
            }
        }
    } 
}

let bd = new Bd



function criarAnotacao() {
    let titulo = document.getElementById('titulo').value
    let descricao = document.getElementById('descricao').value
    let cor = document.getElementById('cor').value
    
    //Formatando horário
    let hora = new Date(),
        dia = hora.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (hora.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = hora.getFullYear()
        horaTotal = `${diaF}/${mesF}/${anoF}`
    
    let anotacao = new Anotacao(titulo, descricao, horaTotal, cor)

    bd.registrarNota(anotacao)
}

function carregaNotas(b) {
    let nota = Array()

    nota = bd.recuperarRegistro()

    let cardList = document.getElementById('card-list')

    if(b == 'adicionar') {
        nota = nota.slice(nota.length - 1, nota.length)
    } else {
        nota = nota
    }


    nota.forEach(a => {  
        let card = document.createElement('div')
        let cardHeader = document.createElement('div')
        let cardBody = document.createElement('div')
        let titulo = document.createElement('h5')
        let novoDescricaoDiv = document.createElement('div')
        let novoDescricao = document.createElement('textarea')
        let descricao = document.createElement('p')
        let btn = document.createElement('button')
        let btnAlt = document.createElement('button')
        let btnAdd = document.createElement('button')
        let btnPrev = document.createElement('button')
        let btnNext = document.createElement('button')
        let rodape = document.createElement('div')

        novoDescricaoDiv.appendChild(novoDescricao)
        novoDescricaoDiv.className = 'input-group input-group-sm'
        novoDescricao.className = 'form-control'

        cardList.appendChild(card)
        card.className = 'card ' + a.cor
        card.style.width = "16rem"
        card.setAttribute('id', 'id')
        window.addEventListener('click', function(e){   
            if (card.contains(e.target) || btnAlt.contains(e.target)){
                card.classList.add('cardSelected')
                descricao.innerHTML = a.descricao

                //botão p/ alterar conteudo
                card.appendChild(btnAlt)
                btnAlt.onclick = function() {
                    novoDescricao.value = a.descricao
                    cardBody.replaceChild(novoDescricaoDiv, descricao)
                    card.appendChild(btnAdd)
                }

                //botão parar inserir novo conteudo
                btnAdd.onclick = function() {
                    a.descricao = novoDescricao.value
                    descricao.innerHTML = a.descricao
                    cardBody.replaceChild(descricao, novoDescricaoDiv)
                    let anotacaoAlterada = new Anotacao(a.titulo, a.descricao, a.hora, a.cor)
                    bd.alterarValor(a.id, anotacaoAlterada)

                    btnAdd.remove()
                    btnAlt.remove()
                }

            } else{
                card.classList.remove('cardSelected')
                btnAlt.remove()
                if(a.descricao.length >= 87) {
                    descricao.innerHTML = a.descricao.slice(0, 87)  + '...'
                } else {
                    descricao.innerHTML = a.descricao
                }
            }
          })
        
        card.appendChild(cardBody)
        cardBody.className = 'card-body'

        cardBody.appendChild(titulo)
        titulo.className = 'card-title'
        titulo.innerHTML = a.titulo

        cardBody.appendChild(descricao)
        descricao.className = 'card-text'
        if(a.descricao.length >= 87) {
            descricao.innerHTML = a.descricao.slice(0, 87)  + '...'
        } else {
            descricao.innerHTML = a.descricao
        }
        
        cardBody.appendChild(btn)
        btn.className = 'btn btn-sm btn-danger'
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        btn.onclick = function() {
            bd.removerNota(a.id)
            card.remove()
        }

        btnPrev.className = 'btn btn-sm'
        btnPrev.innerHTML = '<i class="fas fa-angle-left"></i>'
        btnNext.className = 'btn btn-sm'
        btnNext.innerHTML = '<i class="fas fa-angle-right"></i>'

        btnAlt.className = 'btn btn-warning btn-sm m-2'
        btnAlt.innerHTML = 'Alterar descrição'
        btnAdd.className = 'btn btn-success btn-sm m-2'
        btnAdd.innerHTML = 'Confirmar'

        cardBody.appendChild(btnPrev)
        cardBody.appendChild(btnNext)
        
        card.appendChild(rodape)
        rodape.className = 'card-footer text-center'
        rodape.innerHTML = a.hora

        btnPrev.onclick = function() {
            bd.alterarOrdem(a.id, 'neg')
            window.location.reload()
           
        }
        btnNext.onclick = function() {
            bd.alterarOrdem(a.id, 'pos')
            window.location.reload()
        }
    });  

}
