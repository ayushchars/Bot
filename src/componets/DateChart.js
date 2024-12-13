import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function DateChart() {
    const state = useSelector((state) => state.auth?.languageByDate);

    const dates = [];
    const languages = new Set();
    const groupedData = {};

    for (const [language, datesData] of Object.entries(state)) {
        for (const [date, { attempt, correct }] of Object.entries(datesData)) {
            if (!groupedData[date]) groupedData[date] = {};
            if (!groupedData[date][language]) groupedData[date][language] = { attempts: 0, correct: 0 };

            groupedData[date][language].attempts += attempt;
            groupedData[date][language].correct += correct;

            languages.add(language);
            if (!dates.includes(date)) dates.push(date);
        }
    }

    dates.sort();
    const colors = {
        react: 'rgba(75, 192, 192, 0.6)',
        'react js': 'rgba(54, 162, 235, 0.6)',
        css: 'rgba(255, 99, 132, 0.6)',
        js: 'rgba(153, 102, 255, 0.6)',
    };

   
    const datasets = [];
    languages.forEach((language) => {
        const attemptsData = [];
        const correctData = [];

        dates.forEach((date) => {
            if (groupedData[date] && groupedData[date][language]) {
                attemptsData.push(groupedData[date][language].attempts);
                correctData.push(groupedData[date][language].correct);
            } else {
                attemptsData.push(0);
                correctData.push(0);
            }
        });

        datasets.push({
            label: `${language} Attempts`,
            data: attemptsData,
            backgroundColor: colors[language] || 'rgba(200, 200, 200, 0.6)',
            borderColor: colors[language] || 'rgba(200, 200, 200, 1)',
            borderWidth: 1,
            stack: language
        });

        datasets.push({
            label: `${language} Correct`,
            data: correctData,
            backgroundColor: colors[language] || 'rgba(200, 200, 200, 0.3)',
            borderColor: colors[language] || 'rgba(200, 200, 200, 1)',
            borderWidth: 1,
        });
    });

    // Chart data
    const data = {
        labels: dates,
        datasets,
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Dates',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Count',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Attempts and Correct Answers by Language and Date',
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Bar data={data} options={options} />
        </div>
    );
}

export default DateChart;
