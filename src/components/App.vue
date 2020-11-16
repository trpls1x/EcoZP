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
                    <select id="select" class="form-control" v-model="chartName">
                        <option value="" disabled>Графіки</option>
                        <option value="Комплексне ІЗА" selected>Комплексне ІЗА</option>
                        <option value="Завислі речовини">Завислі речовини</option>
                        <option value="Діоксид сірки">Діоксид сірки</option>
                        <option value="Оксид вуглецю">Оксид вуглецю</option>
                        <option value="Діоксид азоту">Діоксид азоту</option>
                        <option value="Оксид азоту">Оксид азоту</option>
                        <option value="Фенол">Фенол</option>
                        <option value="Фтористий водень">Фтористий водень</option>
                        <option value="Хлористий водень">Хлористий водень</option>
                        <option value="Формальдегід">Формальдегід</option>
                    </select>
                </div>	

                <div class="col-12 col-sm-6 col-lg-3">
                    <input type="text" class="form-control" placeholder="Date">
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <input type="text" class="form-control" placeholder="Date">
                </div>
                <button @click="check">check</button>
               
                <table border="" v-if="days.length != 0">
                    <tr>
                        <th>data</th>
                    </tr>
                    <tr v-for="item in days" :key="item.id">
                        <td>{{item.Date}}</td>
                    </tr>
                </table>
                <div class="chart">
                    <!-- {{chartName}} -->
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

    export default {
        data: function() {
            return {
                chartName:'Комплексне ІЗА',
                days: [],
            };
        },
        mounted() {
            //this.days = days;
             // console.log(this.days)
        },
        methods: {
            check() {
                console.log(this.days)
            },
            async onFileChange(e) {
                console.log("1",this);
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
                console.log("2",this.days)
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

    footer {
        margin-top: 25px;
        width: 100%;
    }

    footer img {
        height: 10vh;
    }
</style>