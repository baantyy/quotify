//quotes url
const quoteUrl = "https://banty.in/json/quotes"
const body = document.getElementsByTagName("body")[0]

if(body.classList.contains('randomApiQuotes')){

	const randomQuoteBtn = document.getElementById("randomQuoteBtn")
	const quoteHandle = document.getElementById("quote")
	const authorHandle = document.getElementById("author")
	const imgLoaderHandle = document.getElementById("imgLoader")

	const saveToLocal = document.getElementById("saveToLocal")
	const saveToLocalText = document.getElementById("saveToLocalText")

	//1. generate random quotes from url
	function getRandomQuoteFromUrl(){
		const xhr = new XMLHttpRequest()
		xhr.open("GET",quoteUrl,true)
		xhr.send()
		xhr.onload = function(){
			const quotes = JSON.parse(xhr.responseText)
			const randomIndex = Math.floor(Math.random() * quotes.length)
			imgLoaderHandle.classList.add("d-none")
			quoteHandle.innerHTML = quotes[randomIndex].quote
			authorHandle.innerHTML = quotes[randomIndex].author
			if(saveToLocal.classList.contains("saved")){
				saveToLocal.classList.remove("saved")
				saveToLocalText.innerHTML = 'Save to Local'
			}
		}
		xhr.onerror = function(){
			imgLoaderHandle.classList.add("d-none")
			quoteHandle.innerHTML = "Unable to get random quote"
		}
	}
	getRandomQuoteFromUrl()

	randomQuoteBtn.addEventListener("click",function(){
		quoteHandle.innerHTML = ""
		authorHandle.innerHTML = ""
		imgLoaderHandle.classList.remove("d-none")
		getRandomQuoteFromUrl()
	})


	//2. save random quotes to local
	let localQuotes = []
	if(localStorage.getItem("localQuotes")){
		localQuotes = JSON.parse(localStorage.getItem("localQuotes"))
	}else{
		localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
	}

	saveToLocal.addEventListener("click",function(e){
		e.preventDefault()
		if(!saveToLocal.classList.contains("saved")){
			const saveRandomQuote = {
				id: Number(new Date()) + Math.round(Math.random()*1000),
				quote: quoteHandle.innerHTML,
				author: authorHandle.innerHTML
			}
			localQuotes.push(saveRandomQuote)
			localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
			saveToLocal.classList.add("saved")
			saveToLocalText.innerHTML = 'Saved'
			console.log(localQuotes)
		}
	})

}else if(body.classList.contains('randomLocalQuotes')){

	//3. generate random quotes from localstorage
	const randomQuoteBtn = document.getElementById("randomQuoteBtn")
	const quoteHandle = document.getElementById("quote")
	const authorHandle = document.getElementById("author")

	let localQuotes = []
	if(localStorage.getItem("localQuotes")){
		localQuotes = JSON.parse(localStorage.getItem("localQuotes"))
	}
	console.log(localQuotes)

	function getRandomQuoteFromLocal(){		
		if(localQuotes.length > 0){
			const randomIndex = Math.floor(Math.random() * localQuotes.length)
			quoteHandle.innerHTML = localQuotes[randomIndex].quote
			authorHandle.innerHTML = localQuotes[randomIndex].author
		}
	}
	getRandomQuoteFromLocal()

	randomQuoteBtn.addEventListener("click",function(){
		getRandomQuoteFromLocal()
	})

}else if(body.classList.contains('addQuote')){

	//4. add new quote
	const quoteForm = document.getElementById("quoteForm")
	const saveQuoteBtn = document.getElementById("saveQuoteBtn")

	const quoteHandle = document.getElementById("quote")
	const authorHandle = document.getElementById("author")

	const quoteErrorHandle = document.getElementById("quoteError")
	const authorErrorHandle = document.getElementById("authorError")
	const formStatus = document.getElementById("formStatus")

	quoteForm.addEventListener("submit",function(e){

		e.preventDefault()
		quoteErrorHandle.innerHTML = ""
		authorErrorHandle.innerHTML = ""
		formStatus.innerHTML = ""

		quoteErrorHandle.classList.add("d-none")
		authorErrorHandle.classList.add("d-none")
		formStatus.classList.add("d-none")

		if(quoteHandle.value == ''){
			quoteErrorHandle.classList.remove("d-none")
			quoteErrorHandle.innerHTML = "<span class='error'>Quote is required</span>"
		}else if(authorHandle.value == ''){
			authorErrorHandle.classList.remove("d-none")
			authorErrorHandle.innerHTML = "<span class='error'>Author name is required</span>"
		}else{

			let localQuotes = []
			if(localStorage.getItem("localQuotes")){
				localQuotes = JSON.parse(localStorage.getItem("localQuotes"))
			}else{
				localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
			}

			const addNewQuote = {
				id: Number(new Date()) + Math.round(Math.random()*1000),
				quote: quoteHandle.value,
				author: authorHandle.value
			}
			console.log(addNewQuote)

			localQuotes.push(addNewQuote)
			localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
			formStatus.classList.remove("d-none")
			formStatus.innerHTML = "<span class='success'>Successfully saved new Quote</span>"

			quoteForm.reset()
		}
	})

}else if(body.classList.contains('listAllQuotes')){

	//5. Read, Update, Delete Quotes
	const quoteList = document.getElementById("quoteList")

	let localQuotes = []
	if(localStorage.getItem("localQuotes")){
		localQuotes = JSON.parse(localStorage.getItem("localQuotes"))
	}

	function deleteQuote(id){
		if(confirm("Are you sure ?")){
			const index = localQuotes.findIndex(function(quote){
				return quote.id == id
			})
			localQuotes.splice(index,1)
			localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
			showAllQuotes()
		}
	}

	function editQuote(button,id){
		const index = localQuotes.findIndex(function(quote){
			return quote.id == id
		})
		const quote = localQuotes[index].quote
		const author = localQuotes[index].author
		
		// showAllQuotes()
		const parent = button.closest("div.quoteItem")
		const viewBox = parent.querySelector(".view")
		const editBox = parent.querySelector(".edit")

		viewBox.classList.add("d-none")
		editBox.innerHTML = `
		<form class="quoteForm" action="#0">
			<textarea placeholder="Quote">${quote}</textarea>
			<p class="status d-none quoteError"></p>

			<input type="text" placeholder="Author Name" value="${author}">
			<p class="status d-none authorError"></p>

			<div class="updatebtn">
				<button type="button" class="getQuote" onclick="updateQuote(this,${id})">Update</button>
				<button type="button" class="getQuote cancel" onclick="cancelQuoteEdit(this)">Cancel</button>
			</div>
			<p class="status d-none"></p>
		</form>`

	}

	function cancelQuoteEdit(button){
		const parent = button.closest("div.quoteItem")
		const viewBox = parent.querySelector(".view")
		const editBox = parent.querySelector(".edit")
		editBox.innerHTML = ""
		viewBox.classList.remove("d-none")
	}

	function updateQuote(button,id){
		const parent = button.closest("div.quoteItem")
		const viewBox = parent.querySelector(".view")
		const editBox = parent.querySelector(".edit")
		const quoteHandle = parent.querySelector("p.quote")
		const authorHandle = parent.querySelector("p.author")

		const form = button.closest("form.quoteForm")
		const quote = form.querySelector("textarea").value
		const author = form.querySelector("input").value

		const quoteError = form.querySelector(".quoteError")
		quoteError.innerHTML = ""
		const authorError = form.querySelector(".authorError")
		authorError.innerHTML = ""
		quoteError.classList.add("d-none")
		authorError.classList.add("d-none")

		const index = localQuotes.findIndex(function(quote){
			return quote.id == id
		})

		if(quote == ''){
			quoteError.classList.remove("d-none")
			quoteError.innerHTML = "<span class='error'>Quote is required</span>"
		}else if(author == ''){
			authorError.classList.remove("d-none")
			authorError.innerHTML = "<span class='error'>Author name is required</span>"
		}else{
			localQuotes[index].quote = quote
			localQuotes[index].author = author
			localStorage.setItem("localQuotes",JSON.stringify(localQuotes))
			
			editBox.innerHTML = ""
			quoteHandle.innerHTML = quote
			authorHandle.innerHTML = author
			viewBox.classList.remove("d-none")
		}
	}

	function showAllQuotes(){
		//if(localQuotes.length > 0){
			let output = ""
			localQuotes.forEach(function(quoteItem){
				const id = quoteItem.id
				const quote = quoteItem.quote
				const author = quoteItem.author

				output += `
				<div class="quoteItem">
					<div class="view">
						<p class="quote">${quote}</p>
						<p class="author">${author}</p>
						<div class="action">
							<button title="Edit" onclick="editQuote(this,${id})"><img src="edit.png"></button>
							<button title="Delete" onclick="deleteQuote(${id})"><img src="delete.png"></button>
						</div>
					</div>
					<div class="edit"></div>
				</div>`
			})
			quoteList.innerHTML = output
		}
	//}
 	showAllQuotes()

}