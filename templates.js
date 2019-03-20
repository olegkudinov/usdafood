function Templates(resultElement) {

    let _fmt = function(value){
        return Math.round(value * 100)/100;
    }

    let _buildNutientHtml = function (data, mutiplicator, byCalories) {
        let _factorCaption = "x " + (mutiplicator == 10 ? 1 : mutiplicator + 1);
        let _baseCaption = byCalories ? "By Weight" : "By Calories";
        let factor = (byCalories ? 100.0 / data.energy.value : 1.0) * mutiplicator;
        
        let nutrients = '';
        data.nutrients.forEach(element => {
            let header = element.nutrient[0] === "*";
            let unitless = element.content.unit === "header";
            let row = '';
            if (header && unitless) {
                row = '<tr><td colspan="2"><strong>' + element.nutrient.replace('**', '').replace('**', '') + '</strong></td></tr>'
            } else if (header) {
                row = '<tr><td><strong>' + element.nutrient.replace('**', '').replace('**', '') + '</strong></td><td><strong>' + _fmt(element.content.value * factor) + '</strong>&nbsp;<strong>' + element.content.unit + '</strong></td></tr>';
            } else {
                row = '<tr><td><em>' + element.nutrient + '</em></td><td><strong>' + _fmt(element.content.value * factor) + '</strong>&nbsp;<strong>' + element.content.unit + '</strong></td></tr>';
            }
            
            nutrients += row;
        });
    
        var weightUS = data.weight.value / 100 * 3.5274;
        var weightStr = _fmt(data.weight.value * factor) + '&nbsp;' + data.weight.unit + '&nbsp;/&nbsp;' + _fmt(weightUS * factor) + '&nbsp;oz';
    
        let totals = `
        <div><em>Weight:</em><strong> ` + weightStr + `</strong></div>
        <div><em>Energy:</em><strong> ` + _fmt(data.energy.value * factor) + ` ` + data.energy.unit + `</strong></div>`;
    
        if (byCalories) {
            totals = `
        <div><em>Energy:</em><strong> ` + _fmt(data.energy.value * factor) + ` ` + data.energy.unit + `</strong></div>
        <div><em>Weight:</em><strong> ` + weightStr + `</strong></div>`;
        }
    
        const result = `
        <div>
           <strong>` + data.foodName + `&nbsp;&nbsp;&nbsp;</strong>
        </div>
        <div>
           <button id='toggler' onclick='app.toggleBase()'>` + _baseCaption + `</button>
           <button id='multiplier' onclick='app.multiply()'>` + _factorCaption + `</button>
        </div>`
            + totals + `
        <table>
            <thead>
                <th>Nutrition</th>
                <th>Content</th>
            </thead>
            <tbody>` +
            nutrients + `
            </tbody>
        </table>`;
        
        resultElement.innerHTML = result;
    }

    let _buildFoodHtml = function(data) {
    
        let foodHtml = '';
        data.forEach(element => {
            let id = element.id
            foodHtml += `
                <tr>
                    <td>` + element.name + `</td>
                    <td><button onclick='app.getNutrientsFor("` + id + `")'>Nutrients</button></td>
                </tr>`;
        });
        
        let result = `
        <table>
            <thead>
                <th></th>
                <th></th>
            </thead>
            <tbody>` +
            foodHtml + `
            </tbody>
        </table>`;
        
        resultElement.innerHTML =  result;
    }
    
    return {
        foods: _buildFoodHtml,
        nutrition: _buildNutientHtml,
    }
};

