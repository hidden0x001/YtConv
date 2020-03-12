const btn = document.getElementsByTagName('label');
const baseClr = 'rgb(35, 90, 102)';
for(let i = 0; i < btn.length; ++i)
{
	btn[i].addEventListener('click', handler);
}
function handler(event)
{
	for(let i = 0; i < btn.length; ++i)
	{
		btn[i].style.backgroundColor = baseClr;
	}
	event.target.style.backgroundColor = 'white';
}