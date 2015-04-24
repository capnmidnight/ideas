var card = {};
card.CardType = function(name, score, cssClass, showPlayedBy)
{
	this.name = name;
	this.score = score;
	this.cssClass = cssClass;
	this.showPlayedBy = showPlayedBy;
};
card.CardType.prototype.getName = function()
{
	return this.name;
};
card.CardType.prototype.getScore = function()
{
	return this.score;
};
card.CardType.prototype.getCssClass = function()
{
	return this.cssClass;
};

card.CardType.prototype.getShowPlayedBy = function()
{
    return this.showPlayedBy;
};

card.CardTypes = [
	new card.CardType("Solution", 15, "solution"),
	new card.CardType("Issue", 25, "issue"),
	new card.CardType("Corruption", 5, "corrupt"),
	new card.CardType("Combat L1", 5, "combat"),
	new card.CardType("Combat L2", 10, "combat"),
	new card.CardType("Combat L3", 20, "combat"),
	new card.CardType("Combat L4", 40, "combat"),
	new card.CardType("Command", 5, "command")
];
card.findCardType = function(type)
{
	for(var i = 0; i < card.CardTypes.length; ++i)
	{
		if(card.CardTypes[i].getName() == type)
		{
			return card.CardTypes[i];
		}
	}
	return null;
}
card.makeCard = function(title, type, user, date, description, showPlayedBy)
{
	var cardType = card.findCardType(type);
	if(cardType == null)
	{
		throw new Exception("Could not find card type: " + type);
	}
	
	var elements = [cardType];

	var temp = document.createElement("h1");
	temp.innerHTML = title;
	elements.push(temp);
	
	temp = document.createElement("h2");
	temp.innerHTML = cardType.getName();
	elements.push(temp);

	if(cardType.getShowPlayedBy())
	{	
    	temp = document.createElement("h3");
    	temp.innerHTML = "played by " + user + " on " + date;
    	elements.push(temp);
    }
	
	temp = document.createElement("div");
	temp.className = "icon";
	elements.push(temp);
	
	temp = document.createElement("p");
	temp.innerHTML = description;
	elements.push(temp);
	
	temp = document.createElement("div");
	temp.className = "score";
	temp.innerHTML = cardType.getScore() + " points";
	elements.push(temp);
	
	return elements;
};
card.addCardElements = function(element)
{
	var params = eval("({"+element.innerText+"})");
	element.innerHTML = "";
	var temp = card.makeCard(
		params.title,
		params.type,
		params.user,
		params.date,
		params.description);
	var cardType = temp.shift();
	console.log(element.cssClass);
	console.log(cardType.getCssClass());
	element.className += " " + cardType.getCssClass();
	while(temp.length > 0)
	{
		element.appendChild(temp.shift());
	}
};
card.makeAllCards = function()
{
	var elements = document.getElementsByClassName("card");
	for(var i = 0; i < elements.length; ++i)
	{
		card.addCardElements(elements[i]);
	}
};
