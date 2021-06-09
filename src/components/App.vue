<template>
    <div class="wrap">
        <nav>
            <div class="container"><p class="logo">EcoZP</p></div>
            
        </nav>
            
        <section class="container">
            <div class="row">

                <div class="">
                </div>  
                <div class="col-12 col-sm-5">Завантажте файли для опрацювання 
                </div>
                <div class="col-12 col-sm-6">
                    <input type="file" accept="application/json" @change="onFileChange" >
                </div>
                
                <hr>
                
                <div class="col-9 col-lg-5 order-1">
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

                <div class="col-12 col-sm-6 col-lg-3 order-3 order-lg-2">
                    <input type="date" class="form-control datepicker" placeholder="Date" v-model="dateFrom">
                </div>
                <div class="col-12 col-sm-6 col-lg-3 order-4 order-lg-3">
                    <input type="date" class="form-control datepicker" placeholder="Date" v-model="dateTo" @change="buildByDates()">
                </div>
                <div class="col-3 col-lg-1 order-2 order-lg-4">
                    <button type="button" class="btn btn-outline-secondary" @click="clearFilters"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar-times" class="svg-inline--fa fa-calendar-times fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M311.7 374.7l-17 17c-4.7 4.7-12.3 4.7-17 0L224 337.9l-53.7 53.7c-4.7 4.7-12.3 4.7-17 0l-17-17c-4.7-4.7-4.7-12.3 0-17l53.7-53.7-53.7-53.7c-4.7-4.7-4.7-12.3 0-17l17-17c4.7-4.7 12.3-4.7 17 0l53.7 53.7 53.7-53.7c4.7-4.7 12.3-4.7 17 0l17 17c4.7 4.7 4.7 12.3 0 17L257.9 304l53.7 53.7c4.8 4.7 4.8 12.3.1 17zM448 112v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path></svg></button>
                </div>
                <div class="chart-wrap col-12 order-5">
                    <div class="chart" :style="{ width: chartWidth + 'vw' }">
                        <line-chart :chart-data="datacollection" :options="chartOptions"></line-chart>
                    </div>
                </div>

                <div class="col-lg-6 order-6 days-counter-wrap">
                    <span>Всього днів в графіку:</span>
                    <span class="days-counter">{{totalDays}}</span>
                </div>
                <div class="col-lg-6 order-7 days-counter-wrap">
                    <span>Днів з перевищенням норми:</span>
                    <span class="days-counter days-counter-red">{{excessDays}}</span>
                </div >

                <hr class="order-8">
            </div>
        </section>
        <footer class="container">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <p>ІЗА - індекс забруднення атмосфери</p>
                    <p>Дані взяті з офіційного сайту Міністерства захисту довкілля та природних ресурсів України</p>
                </div>
                <div class="col-12 col-lg-5">
                    <p>Актуальні дані можна отримати <a target="_blank" href="https://drive.google.com/uc?export=download&id=1tGS9m3OE73TQaCFIlgKgjc6C6zW3i2y9">тут</a></p>
                    <p>Розробник - <a target="_blank" href="http://trpls1x.github.io">Boyko</a></p>
                </div>
                <div class="col-12 col-lg-1 d-flex justify-content-center align-items-center"><img src="/images/logo.png" alt="logo"></div>
            </div>
        </footer>

    </div>
</template>

<script>
    import Vue from 'vue'
    import dangerClass from '../data/dangerClass.json'
    import LineChart from '../LineChart.js'
    import VueMoment from 'vue-moment'
    import moment from 'moment-timezone'
    
    Vue.use(VueMoment, {
        moment,
    })
    import { Datetime } from 'vue-datetime'
    import 'vue-datetime/dist/vue-datetime.css'

    export default {
        components: {
            LineChart,
            datetime: Datetime
        },
        data() {
            return {
                chartName: "KIZA",
                url: "",
                days: [],
                dangerClass: [],
                dateLabels: [],
                dateFrom: '',
                dateTo: '',
                datacollection: null,
                chartOptions: null,
                chartWidth: 100,
                totalDays: 0,
                excessDays: 0
            };
        },
        mounted() {
            this.chartOptions = {
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                        position: 'left'
                }
            }
        },
        methods: {
            TEST(){
                console.log(this.testvar)
            },
            fillData(property) {
                
                let chartData = this.days.map((day) => {
                    return day[property]
                })

                var maxData;
                if(property == "KIZA")
                    maxData = Array(this.days.length).fill(9);
                else
                    maxData = Array(this.days.length).fill(1);

                this.datacollection = {
                    labels: this.dateLabels,
                    datasets: [
                        {
                            label: property,
                            data: chartData,
                            backgroundColor: "transparent",
                            borderColor: "#05CBE1",
                            pointBackgroundColor: "white",
                            borderWidth: 1.2,
                        }, 
                        {
                            label: 'Max',
                            data: maxData,
                            backgroundColor: "transparent",
                            borderColor: "#FC2525",
                            pointRadius: 0,
                            borderWidth: 3,
                        }
                    ],
                }
                this.totalDays = this.days.length;
                this.countExcessDays(property, maxData[0]);
            },
            async onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                var reader = new FileReader();
                const result = await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result)
                    }
                   reader.readAsText(files[0]);
                })
                this.days = JSON.parse(result);
                this.convertToDot(this.days);
                this.fillDates();
                this.fillData(this.chartName)
            },
            onButtonClick(){
            },
            gotData(data) {
                console.log(data);
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
            },
            convertToDot(array) {
                array.forEach(element => {
                    Object.keys(element).forEach(function(key) {
                        element[key] = element[key].toString().replace(/,/g, '.')
                    });
                    element.KIZA = this.calculateKIZA(element);
                });
            },
            fillDates() {
                let Dates = this.days.map((day) => {
                    return day.Date;
                });
                this.dateLabels = [...new Set(Dates)];
                this.chartWidth = this.days.length * 5;
            },
            buildByDates() {
                let dFrom = this.$moment(this.dateFrom).unix();
                let dTo = this.$moment(this.dateTo).unix();
                // if (this.dateFrom != '') {
                    this.days = this.days.filter((day) => {
                        let d = this.$moment(day.Date,'DD.MM.YYYY').unix();
                        return ((+Number(d)>=+Number(dFrom)) && (+Number(d)<=+Number(dTo)));
                    })
                    this.fillDates();
                    this.fillData(this.chartName);
                // }
                console.log(this.dateFrom);
                console.log(this.dateTo);
            },
            countExcessDays(prop, max) {
                this.excessDays = 0;
                this.days.forEach(element => {
                    if (element[prop] > max)
                        this.excessDays++;
                });
            },
            clearFilters() {
                this.dateFrom = '';
                this.dateTo = '';
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
        overflow: hidden;
    }

    hr {
        width: 100%;
    }

    nav {
        background: linear-gradient(90deg, #20d35c 0%, rgba(0,219,255,1) 100%);
        margin-bottom: 3vh;
        padding: .8%;
        box-shadow: 0px 3px 10px 3px rgba(0,0,0,0.11);
    }

    .logo {
        color: #f7f7f7;
        font-size: 2rem;
        font-weight: 800;
        margin: 0;
    }

    .btn {
        width: 100%;
        border-color: #d4d4d4;
        background: #fff;
    }

    .btn:hover {
        background: linear-gradient(90deg, #20d35c 0%, rgba(0,219,255,1) 100%);
        border : none;
    }

    svg {
        height: 19px;
        width: 100%;
        color: black;
    }

    .btn:hover > svg {
        color: #f7f7f7;
    }


    .chart-wrap {  
        width: 100%;
        min-height: 70vh;
        font-size: 1.5rem;
        margin: 2vh 0;
        border: 3px solid;
        border-image: linear-gradient(
            to right, 
            #20d35c, 
            rgba(0,249,255,1)
        ) 0 100%;
        overflow: auto;
        overflow-y: hidden;
    }

    .chart {
        position: relative;
        min-width: 100vw;
        height: 70vh;
    }

    .chart * {
        width: 100%;
        height: 100%;
    }

    .days-counter {
        margin-left: 1%;
        font-size: 1.5rem;
        font-weight: 800;
        background: linear-gradient(90deg, #20d35c 0%, rgba(0,219,255,1) 100%);
        background-clip: border-box;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .days-counter-red {
        background: linear-gradient(90deg, #ac0000 0%, #190A05 150%);
        background-clip: border-box;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    footer {
        margin-top: 25px;
        width: 100%;
    }

    footer img {
        height: 10vh;
    }

    a {
        background: linear-gradient(90deg, #20d35c 0%, rgba(0,219,255,1) 100%);
        font-weight: 800;
        font-size: 1.2rem;
        background-clip: border-box;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }


    @media only screen and (max-width: 990px) {
        .datepicker {
            margin-top: 10px;
        }

        .days-counter-wrap {
            text-align: center;
        }

        footer * {
            text-align: center;
        }
    }

</style>