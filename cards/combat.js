var card = {};
card.CardType = function(name, level, cssClass)
{
    this.name = name;
	this.level = level;
	this.cssClass = cssClass;
};
card.CardType.prototype.getName = function()
{
	return this.name;
};
card.CardType.prototype.getLevel = function()
{
	return this.level;
};
card.CardType.prototype.getCssClass = function()
{
	return this.cssClass;
};

card.CardTypes = [
	new card.CardType("Combat L1", 1, "combat combat1"),
	new card.CardType("Combat L2", 2, "combat combat2"),
	new card.CardType("Combat L3", 3, "combat combat3"),
	new card.CardType("Combat L4", 4, "combat"),
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
card.makeCard = function(title, type, atk, def)
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
	
	temp = document.createElement("div");
	temp.className = "icon";
	elements.push(temp);
	
	temp = document.createElement("div");
	temp.className = "stats";
	temp.innerHTML = atk + " ATK<br>" + def + " DEF";
	elements.push(temp);
	
	temp = document.createElement("div");
	temp.className = "level";
	temp.innerHTML = "L" + cardType.getLevel();
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
		params.atk,
		params.def);
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
