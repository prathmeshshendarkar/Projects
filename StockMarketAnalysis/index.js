// index.js
// import Chart from 'chart.js/auto'

const Stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function renderChart(stock, timeRange = '5y') {
    try {
        const stockData = await fetchData(`https://stocks3.onrender.com/api/stocks/getstocksdata`);
        const selectedStockData = stockData.stocksData[0];

        const stockInfo = selectedStockData[stock];
        console.log(stockData);
        if (!stockInfo || !stockInfo['5y'] || !stockInfo['5y'].timeStamp || !stockInfo['5y'].value) {
            console.error(`No data available for ${stock}`);
            return;
        }
        
        function convert(str) {
            var date = new Date(str),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
        }

        // Get the chart canvas element
        const chartCanvas = document.getElementById('acquisitions');

        // Destroy the previous chart if it exists
        if (chartCanvas && chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        const prices = stockInfo[timeRange].value;
            const times = stockInfo[timeRange].timeStamp.map(timestamp => new Date(timestamp * 1000));
            console.log(prices);
            console.log(times);
            
        new Chart(
            document.getElementById('acquisitions'),
            {
            type: 'line',
            data: {
                labels: times.map((timez) => convert(timez)),
                datasets: [
                {
                    label: 'Acquisitions by year',
                    data: prices
                }
                ]
            }
            }
        );
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}


async function renderStockDetails(stock) {
    try {
        const stockProfileData = await fetchData(`https://stocks3.onrender.com/api/stocks/getstocksprofiledata`);
        const selectedProfileData = stockProfileData.stocksProfileData.find(data => Object.keys(data).includes(stock));
        const summary = selectedProfileData[stock].summary;

        const stockStatsData = await fetchData(`https://stocks3.onrender.com/api/stocks/getstockstatsdata`);
        const { bookValue, profit } = stockStatsData.stocksStatsData[0][stock];

        const stockDetailsContainer = document.getElementById('stockDetails');
        stockDetailsContainer.innerHTML = `
            <h3>${stock}</h3>
            <p>Book Value: ${bookValue}</p>
            <p>Profit: <span style="color: ${profit > 0 ? 'green' : 'red'};">${profit}</span></p>
            <p>${summary}</p>
        `;
    } catch (error) {
        console.error('Error rendering stock details:', error);
    }
}

function renderStockList() {
    const stockListContainer = document.getElementById('stockList');
    stockListContainer.innerHTML = '';
    Stocks.forEach(stock => {
        const listItem = document.createElement('div');
        listItem.textContent = stock;
        listItem.classList.add('stock-item');
        listItem.addEventListener('click', () => {
            // Remove the 'selected' class from all stock items
            document.querySelectorAll('.stock-item').forEach(item => {
                item.classList.remove('selected');
            });
        
            // Add the 'selected' class to the clicked stock item
            listItem.classList.add('selected');
        
            // Call the render functions
            renderChart(stock);
            renderStockDetails(stock);
        });
        stockListContainer.appendChild(listItem);
    });
}

function changeTimeRange(timeRange) {
    const selectedStock = document.querySelector('.stock-item.selected');
    if (!selectedStock) return;
    const stockName = selectedStock.textContent;
    renderChart(stockName, timeRange);
}

window.onload = function() {
    renderStockList();
    if (Stocks.length > 0) {
        renderChart(Stocks[0]);
        renderStockDetails(Stocks[0]);
    }
};
