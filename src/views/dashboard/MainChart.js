import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { CButtonGroup, CButton } from '@coreui/react'

const MainChart = () => {
  const chartRef = useRef(null)
  const containerRef = useRef(null)
  const [chartView, setChartView] = useState('6M'); // 6M, 1Y, YTD
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [containerWidth, setContainerWidth] = useState(0);

  // Detección de cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Medición del ancho del contenedor
  useLayoutEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setContainerWidth(containerRef.current.offsetWidth);
      };
      
      updateSize(); // Medición inicial
      
      // Crear un ResizeObserver para detectar cambios en el tamaño del contenedor
      const observer = new ResizeObserver(updateSize);
      observer.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          updateChartColors();
          chartRef.current.update();
        });
      }
    });
    
    // Establecer colores iniciales
    updateChartColors();
  }, [chartRef]);
  
  // Función para actualizar colores del gráfico según el tema
  const updateChartColors = () => {
    if (!chartRef.current) return;
    
    const isDarkMode = document.documentElement.getAttribute('data-coreui-theme') === 'dark';
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : getStyle('--cui-body-color');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : getStyle('--cui-border-color-translucent');
    
    chartRef.current.options.scales.x.grid.borderColor = gridColor;
    chartRef.current.options.scales.x.grid.color = gridColor;
    chartRef.current.options.scales.x.ticks.color = textColor;
    chartRef.current.options.scales.y.grid.borderColor = gridColor;
    chartRef.current.options.scales.y.grid.color = gridColor;
    chartRef.current.options.scales.y.ticks.color = textColor;
    chartRef.current.options.plugins.legend.labels.color = textColor;
  };

  // Función para simular datos de ventas y compras
  const generateSalesData = (months) => {
    const baseValue = 48000
    return Array(months).fill().map(() => baseValue + Math.random() * 18000)
  }

  const generatePurchasesData = (months) => {
    const baseValue = 32000
    return Array(months).fill().map(() => baseValue + Math.random() * 12000)
  }

  // Obtener los datos según la vista seleccionada
  const getChartData = () => {
    let salesData, purchasesData, labels;
    
    switch(chartView) {
      case '1Y':
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        salesData = generateSalesData(12);
        purchasesData = generatePurchasesData(12);
        break;
      case 'YTD':
        const currentMonth = new Date().getMonth();
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].slice(0, currentMonth + 1);
        salesData = generateSalesData(currentMonth + 1);
        purchasesData = generatePurchasesData(currentMonth + 1);
        break;
      default: // 6M
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        salesData = generateSalesData(6);
        purchasesData = generatePurchasesData(6);
    }
    
    const profitData = salesData.map((sale, index) => sale - purchasesData[index]);
    
    return { labels, salesData, purchasesData, profitData };
  }

  const { labels, salesData, purchasesData, profitData } = getChartData();
  
  // Ajustamos las opciones según el tamaño de la pantalla
  const getLegendPosition = () => {
    if (windowWidth <= 576 || containerWidth < 400) {
      return 'bottom';
    }
    return 'top';
  };
  
  // Calcular altura del gráfico según el contenedor y tipo de pantalla
  const getChartHeight = () => {
    if (windowWidth <= 576) {
      return 180; // Altura para móviles
    } else if (windowWidth <= 768) {
      return 190; // Tablets pequeñas
    } else if (windowWidth <= 992) {
      return 200; // Tablets grandes
    }
    return 210; // Escritorio
  };

  return (
    <div className="main-chart-container" ref={containerRef}>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
        <div className="mb-2 mb-sm-0">
          <h6 className="text-medium-emphasis mb-0 d-none d-sm-block">Período actual: {chartView === '6M' ? '6 Meses' : chartView === 'YTD' ? 'Año Actual' : '12 Meses'}</h6>
        </div>
        <CButtonGroup role="group" size="sm">
          <CButton 
            color={chartView === '6M' ? 'primary' : 'light'} 
            variant={chartView === '6M' ? 'outline' : 'ghost'}
            onClick={() => setChartView('6M')}
            className="chart-btn"
          >
            6M
          </CButton>
          <CButton 
            color={chartView === 'YTD' ? 'primary' : 'light'} 
            variant={chartView === 'YTD' ? 'outline' : 'ghost'}
            onClick={() => setChartView('YTD')}
            className="chart-btn"
          >
            Año Actual
          </CButton>
          <CButton 
            color={chartView === '1Y' ? 'primary' : 'light'} 
            variant={chartView === '1Y' ? 'outline' : 'ghost'}
            onClick={() => setChartView('1Y')}
            className="chart-btn"
          >
            12M
          </CButton>
        </CButtonGroup>
      </div>
      
      <div style={{ position: 'relative', height: getChartHeight(), width: '100%' }}>
        <CChartLine
          ref={chartRef}
          style={{ height: '100%', width: '100%' }}
          data={{
            labels: labels,
            datasets: [
              {
                label: 'Ventas',
                backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
                borderColor: getStyle('--cui-info'),
                pointHoverBackgroundColor: getStyle('--cui-info'),
                pointRadius: 0, // Ocultamos puntos en estado normal
                pointHoverRadius: windowWidth <= 576 ? 2 : 3,
                borderWidth: 1.5,
                data: salesData,
                fill: true,
              },
              {
                label: 'Compras',
                backgroundColor: 'transparent',
                borderColor: getStyle('--cui-warning'),
                pointHoverBackgroundColor: getStyle('--cui-warning'),
                pointRadius: 0, // Ocultamos puntos en estado normal
                pointHoverRadius: windowWidth <= 576 ? 2 : 3,
                borderWidth: 1.5,
                data: purchasesData,
              },
              {
                label: 'Utilidad',
                backgroundColor: 'transparent',
                borderColor: getStyle('--cui-success'),
                pointHoverBackgroundColor: getStyle('--cui-success'),
                pointRadius: 0, // Ocultamos puntos en estado normal
                pointHoverRadius: windowWidth <= 576 ? 2 : 3,
                borderWidth: 1.5,
                data: profitData,
                borderDash: [3, 3],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: getLegendPosition(),
                align: 'center',
                labels: {
                  boxWidth: windowWidth <= 576 ? 8 : 10,
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: windowWidth <= 576 ? 5 : 10,
                  font: {
                    size: windowWidth <= 576 ? 8 : 9
                  },
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : getStyle('--cui-body-color')
                },
              },
              tooltip: {
                enabled: true,
                position: 'nearest',
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('es-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2
                      }).format(context.parsed.y);
                    }
                    return label;
                  }
                },
                padding: 6,
                bodyFont: {
                  size: windowWidth <= 576 ? 8 : 10
                },
                titleFont: {
                  size: windowWidth <= 576 ? 9 : 11
                },
                displayColors: true,
                boxWidth: 8
              }
            },
            scales: {
              x: {
                grid: {
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : getStyle('--cui-border-color-translucent'),
                  drawOnChartArea: false,
                },
                ticks: {
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : getStyle('--cui-body-color'),
                  font: {
                    size: windowWidth <= 576 ? 7 : 9
                  },
                  maxRotation: 0,
                  minRotation: 0
                },
              },
              y: {
                beginAtZero: true,
                border: {
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : getStyle('--cui-border-color-translucent'),
                },
                grid: {
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                  color: document.documentElement.getAttribute('data-coreui-theme') === 'dark' 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : getStyle('--cui-body-color'),
                  maxTicksLimit: windowWidth <= 576 ? 3 : 4,
                  font: {
                    size: windowWidth <= 576 ? 7 : 9
                  },
                  callback: function(value) {
                    return new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN',
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value);
                  }
                },
              },
            },
            elements: {
              line: {
                tension: 0.3,
              },
              point: {
                radius: 0,
                hitRadius: windowWidth <= 576 ? 6 : 8,
                hoverRadius: windowWidth <= 576 ? 2 : 3,
                hoverBorderWidth: windowWidth <= 576 ? 1 : 2,
              },
            },
            interaction: {
              mode: 'index',
              intersect: false,
            },
            responsive: true,
          }}
        />
      </div>
    </div>
  )
}

export default MainChart
