function Formatters(resultElement) {

    let _fmt = function(value){
        return Math.round(value * 100)/100;
    }

    let _buildNutientHtml = function (data, mutiplicator, measure) {
        let _factorCaption = "x " + (mutiplicator == 10 ? 1 : mutiplicator + 1);
        const byCalories = measure === 'calories';
        const byOunces = measure === 'ounces';
        let _baseCaption = 'By Grams';
        if(byCalories)
            _baseCaption = 'By Calories';
        else if(byOunces)
            _baseCaption = 'By Ounces';

        // original measure in 100 grams
        let factor = mutiplicator;
        if(byCalories)
            factor *= 100.0 / data.energy.value;
        else if(byOunces) 
            factor *= 3 / 3.527396;
        
        let nutrients = '';
        data.nutrients.forEach(entry => {
            let header = entry.nutrient[0] === "*";
            let unitless = entry.content.unit === "header";
            let row = '';
            let nutrient = entry.nutrient;
            if (header && unitless) {
                nutrient = entry.nutrient.replace('**', '').replace('**', '');
                row = `<tr><td colspan="2"><strong>${nutrient}</strong></td></tr>`;
            } else if (header) {
                nutrient = entry.nutrient.replace('**', '').replace('**', '');
                row = `<tr><td><strong>${nutrient}</strong></td><td><strong>${_fmt(entry.content.value * factor)}</strong>&nbsp;<strong>${entry.content.unit}</strong></td></tr>`;
            } else {
                row = `<tr><td><em>${nutrient}</em></td><td><strong>${_fmt(entry.content.value * factor)}</strong>&nbsp;<strong>${entry.content.unit}</strong></td></tr>`;
            }
            nutrients += row;
        });
    
        const weightUS = data.weight.value / 100 * 3.5274;
        let weightStr = _fmt(data.weight.value * factor) + '&nbsp;' + data.weight.unit + '&nbsp;/&nbsp;' + _fmt(weightUS * factor) + '&nbsp;oz';
        if (byOunces) {
            weightStr = _fmt(weightUS * factor) + '&nbsp;oz' + '&nbsp;/&nbsp;' + _fmt(data.weight.value * factor) + data.weight.unit; 
        }
    
        let totals = `<div><em>Weight:</em><strong> ${weightStr}</strong></div>
            <div><em>Energy:</em><strong> ${fmt(data.energy.value * factor)} ${data.energy.unit} </strong></div>`;
    
        if (byCalories) {
            totals = `<div><em>Energy:</em><strong> ${_fmt(data.energy.value * factor)} ${data.energy.unit} </strong></div>
                <div><em>Weight:</em><strong> ${weightStr}</strong></div>`;
        }

        const result = `
        <div>
           <strong>${data.foodName}&nbsp;&nbsp;&nbsp;</strong>
        </div>
        <div>
           <button id='toggler' onclick='app.toggleBase()'>${_baseCaption}</button>
           <button id='multiplier' onclick='app.multiply()'>${_factorCaption}</button>
        </div>
        ${totals}        
        <table>
            <thead>
                <th>Nutrition</th>
                <th>Content</th>
            </thead>
            <tbody>
                ${nutrients}
            </tbody>
        </table>`;

        resultElement.innerHTML = result;
    }

    let foodHtml = data => {
        let result = '';
        data.forEach(entry => result += `<tr><td>${entry.name}</td><td><button onclick='app.getNutrientsFor("${entry.id}")'>Nutrients</button></td></tr>`);
        return result;
    };

    let _buildFoodHtml = data => {
        resultElement.innerHTML =  `
        <table>
            <thead>
                <th></th>
                <th></th>
            </thead>
            <tbody>
            ${foodHtml(data)}
            </tbody>
        </table>`;
    }
    
    return {
        foods: _buildFoodHtml,
        nutrition: _buildNutientHtml,
    }
};

