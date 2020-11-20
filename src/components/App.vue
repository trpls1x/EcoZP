<template>
    <div class="wrap">
        <nav>
            <p class="logo">EcoZP</p>
        </nav>
            
        <section class="container">
            <div class="row">
                <div class="col- 12 col-sm-6">Завантажте файли для опрацювання 
                    <a target="_blank" href="https://mepr.gov.ua/news/34713.html"><i class="far fa-question-circle" data-toggle="tooltip" title="Ви можете їх взяти тут"></i></a>
                </div>
                <div class="col-12 col-sm-6">
                    <input type="file" accept="application/json" @change="onFileChange">
                </div>
                
                <hr>
                
                <div class="col-12 col-lg-6">
                    <select id="select" class="form-control" v-model="chartName" @change="fillData(chartName)">
                        <option value="" disabled>Графіки</option>
                        <option value="KIZA" selected>Комплексне ІЗА</option>
                        <option value="dust">Завислі речовини</option>
                        <option value="SO2">Діоксид сірки</option>
                        <option value="CO">Оксид вуглецю</option>
                        <option value="NO2">Діоксид азоту</option>
                        <option value="NO">Оксид азоту</option>
                        <option value="C5H5OH">Фенол</option>
                        <option value="HF">Фтористий водень</option>
                        <option value="HCl">Хлористий водень</option>
                        <option value="CH2O">Формальдегід</option>
                    </select>
                </div>	

                <div class="col-12 col-sm-6 col-lg-3">
                    <input type="text" class="form-control" placeholder="Date">
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <input type="text" class="form-control" placeholder="Date">
                </div>
                <div class="chart">
                    <line-chart :chart-data="datacollection"></line-chart>
                </div>

                <hr>
            </div>
        </section>
        <footer class="container">
            <div class="row">
                <div class="col-12 col-lg-2 d-flex justify-content-center align-items-center"><img src="logo.png" alt="logo"></div>
                <div class="col-12 col-lg-5">
                    <p>ІЗА - індекс забруднення атмосфери</p>
                    <p>Дані взяті з офіційного сайту Міністерства захисту довкілля та природних ресурсів України</p>
                </div>
                <div class="col-12 col-lg-5">
                    <p>© 2020 Бойко Олександр Олександрович</p>
                    <p>Розробник - <a href="http://trpls1x.github.io" target="_blank">Boyko</a></p>
                </div>
            </div>
        </footer>

    </div>
</template>

<script>
    import Vue from 'vue'
    import days from '../data.json'
    import dangerClass from '../dangerClass.json'
    import LineChart from '../LineChart.js'

    export default {
        components: {
            LineChart
        },
        data() {
            return {
                chartName: "KIZA",
                days: [],
                dangerClass: [],
                datacollection: null,
                dateLabels: [],
            };
        },
        mounted() {
            this.days = days,
            days.forEach(element => {
                Object.keys(element).forEach(function(key) {
                    element[key] = element[key].toString().replace(/,/g, '.')
                });
                element.KIZA = this.calculateKIZA(element);
            });
            
            let Dates = this.days.map((day) => {
                return day.Date
            })
            this.dateLabels = [...new Set(Dates)]

            this.fillData(this.chartName)
        },
        methods: {
            fillData(property) {
                let chartData = this.days.map((day) => {
                    return day[property]
                })
                console.log(chartData)

                var maxData
                if(property == "KIZA")
                    maxData = Array(this.days.length).fill(9);
                else
                    maxData = Array(this.days.length).fill(1);

                this.datacollection = {
                    labels: this.dateLabels,
                    datasets: [
                        {
                            label: 'data',
                            data: chartData,
                            backgroundColor: "transparent",
                            borderColor: "#05CBE1",
                            pointBackgroundColor: "white",
                            borderWidth: 1.2,
                        }, 
                        {
                            label: 'max',
                            data: maxData,
                            backgroundColor: "transparent",
                            borderColor: "#FC2525",
                            pointRadius: 0,
                            borderWidth: 3,
                        }
                    ],
                    
                }
                
            },
            async onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                var reader = new FileReader();
                await reader.addEventListener('load', () => {
                    var result = JSON.parse(reader.result);
                    this.days = result;
                });
                reader.readAsText(files[0]);
            },
            calculateKIZA(element) {
                return  Math.pow(element.dust, dangerClass[2].coefficient) + 
                        Math.pow(element.SO2, dangerClass[2].coefficient) + 
                        Math.pow(element.CO, dangerClass[3].coefficient) + 
                        Math.pow(element.NO2, dangerClass[1].coefficient) + 
                        Math.pow(element.NO, dangerClass[2].coefficient) + 
                        Math.pow(element.C5H5OH, dangerClass[3].coefficient) + 
                        Math.pow(element.HF, dangerClass[0].coefficient) + 
                        Math.pow(element.HCl, dangerClass[2].coefficient) + 
                        Math.pow(element.CH2O, dangerClass[1].coefficient);
            }
        }
    }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
    .wrap {
        margin: 0;
        padding: 0;
        background: #f7f7f7;
        font-family: 'Montserrat', sans-serif;
    }

    hr {
        width: 100%;
    }

    nav {
        background: linear-gradient(90deg, rgba(82,255,0,0.7763480392156863) 0%, rgba(0,219,255,1) 100%);
        margin-bottom: 3vh;
        padding: .8%;
        box-shadow: 0px 3px 10px 3px rgba(0,0,0,0.11);
    }

    .logo {
        color: #fff;
        font-size: 2rem;
        margin: 0;
    }

    .chart {  
        width: 100%;
        min-height: 60vh;
        font-size: 1.5rem;
        margin: 2vh 0;
        border: 3px solid;
        border-image: linear-gradient(
            to right, 
            rgba(0,224,18,1), 
            rgba(0,249,255,1)
        ) 0 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .chart * {
        width: 100%;
        height: 100%;
    }

    footer {
        margin-top: 25px;
        width: 100%;
    }

    footer img {
        height: 10vh;
    }
</style>