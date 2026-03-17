// ════════════════════════════════════════════════════════════════
//   WORLD OPERATOR MAP — Prefijos reales por operador y país
//   Estructura: 'prefijo_local': { op, asn, subnet, rdns, tz, country, flag }
// ════════════════════════════════════════════════════════════════

const OPERATOR_MAP = {

    // ══════════════════════════════════════════
    //   LATINOAMÉRICA
    // ══════════════════════════════════════════

    // ── COLOMBIA +57 ──────────────────────────
    '3001': { op: 'Claro Colombia',     asn: 'AS13489',  subnet: '181.49',  rdns: 'mobile-{ip}.claro.net.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3002': { op: 'Claro Colombia',     asn: 'AS13489',  subnet: '181.33',  rdns: 'mobile-{ip}.claro.net.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3003': { op: 'Claro Colombia',     asn: 'AS13489',  subnet: '181.50',  rdns: 'mobile-{ip}.claro.net.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3100': { op: 'Tigo Colombia',      asn: 'AS27831',  subnet: '190.24',  rdns: '{ip}.dynamic.tigo.com.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3101': { op: 'Tigo Colombia',      asn: 'AS27831',  subnet: '190.25',  rdns: '{ip}.dynamic.tigo.com.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3110': { op: 'Tigo Colombia',      asn: 'AS27831',  subnet: '190.26',  rdns: '{ip}.dynamic.tigo.com.co',         tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3200': { op: 'Movistar Colombia',  asn: 'AS27ora',  subnet: '190.85',  rdns: '{ip}.mobile.movistar.net.co',      tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3201': { op: 'Movistar Colombia',  asn: 'AS27ora',  subnet: '181.132', rdns: '{ip}.mobile.movistar.net.co',      tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3500': { op: 'WOM Colombia',       asn: 'AS262186', subnet: '190.248', rdns: 'user-{ip}.wom.co',                 tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },
    '3380': { op: 'ETB Móvil',          asn: 'AS3816',   subnet: '200.118', rdns: '{ip}.etb.net.co',                  tz: 'America/Bogota',                      country: 'Colombia',     flag: '🇨🇴' },

    // ── MÉXICO +52 ────────────────────────────
    '1':    { op: 'Telcel',             asn: 'AS8151',   subnet: '187.141', rdns: '{ip}.mobile.telcel.com',           tz: 'America/Mexico_City',                 country: 'México',       flag: '🇲🇽' },
    '2':    { op: 'Telcel',             asn: 'AS8151',   subnet: '187.188', rdns: '{ip}.mobile.telcel.com',           tz: 'America/Mexico_City',                 country: 'México',       flag: '🇲🇽' },
    '3':    { op: 'AT&T México',        asn: 'AS18734',  subnet: '189.203', rdns: '{ip}.iusacell.net',                tz: 'America/Mexico_City',                 country: 'México',       flag: '🇲🇽' },
    '5':    { op: 'Movistar México',    asn: 'AS6503',   subnet: '189.216', rdns: '{ip}.movistar.net.mx',             tz: 'America/Mexico_City',                 country: 'México',       flag: '🇲🇽' },
    '8':    { op: 'Bait México',        asn: 'AS8151',   subnet: '187.188', rdns: '{ip}.bait.com.mx',                 tz: 'America/Mexico_City',                 country: 'México',       flag: '🇲🇽' },

    // ── VENEZUELA +58 ─────────────────────────
    '4120': { op: 'Movistar Venezuela', asn: 'AS6306',   subnet: '190.202', rdns: '{ip}.movistar.net.ve',             tz: 'America/Caracas',                     country: 'Venezuela',    flag: '🇻🇪' },
    '4140': { op: 'Digitel',            asn: 'AS21826',  subnet: '186.168', rdns: 'dynamic-{ip}.digitel.com.ve',      tz: 'America/Caracas',                     country: 'Venezuela',    flag: '🇻🇪' },
    '4141': { op: 'Digitel',            asn: 'AS21826',  subnet: '186.169', rdns: 'dynamic-{ip}.digitel.com.ve',      tz: 'America/Caracas',                     country: 'Venezuela',    flag: '🇻🇪' },
    '4160': { op: 'Movilnet',           asn: 'AS27889',  subnet: '200.44',  rdns: '{ip}.movilnet.com.ve',             tz: 'America/Caracas',                     country: 'Venezuela',    flag: '🇻🇪' },

    // ── PERÚ +51 ──────────────────────────────
    '9510': { op: 'Movistar Perú',      asn: 'AS6147',   subnet: '190.232', rdns: '{ip}.mobile.telefonica.net.pe',    tz: 'America/Lima',                        country: 'Perú',         flag: '🇵🇪' },
    '9900': { op: 'Claro Perú',         asn: 'AS27843',  subnet: '181.65',  rdns: 'mobile-{ip}.claro.net.pe',         tz: 'America/Lima',                        country: 'Perú',         flag: '🇵🇪' },
    '9760': { op: 'Entel Perú',         asn: 'AS61468',  subnet: '200.60',  rdns: '{ip}.entel.pe',                    tz: 'America/Lima',                        country: 'Perú',         flag: '🇵🇪' },
    '9740': { op: 'Bitel',              asn: 'AS267613', subnet: '181.176', rdns: '{ip}.bitel.com.pe',                tz: 'America/Lima',                        country: 'Perú',         flag: '🇵🇪' },

    // ── ARGENTINA +54 ─────────────────────────
    '911':  { op: 'Personal',           asn: 'AS22927',  subnet: '181.10',  rdns: '{ip}.gprs.personal.com.ar',        tz: 'America/Argentina/Buenos_Aires',      country: 'Argentina',    flag: '🇦🇷' },
    '9150': { op: 'Claro Argentina',    asn: 'AS27747',  subnet: '190.191', rdns: 'mobile-{ip}.claro.net.ar',         tz: 'America/Argentina/Buenos_Aires',      country: 'Argentina',    flag: '🇦🇷' },
    '9160': { op: 'Movistar Argentina', asn: 'AS22084',  subnet: '200.49',  rdns: '{ip}.mobile.movistar.net.ar',      tz: 'America/Argentina/Buenos_Aires',      country: 'Argentina',    flag: '🇦🇷' },

    // ── CHILE +56 ─────────────────────────────
    '9':    { op: 'Entel Chile',        asn: 'AS22047',  subnet: '190.98',  rdns: '{ip}.dynamic.entel.cl',            tz: 'America/Santiago',                    country: 'Chile',        flag: '🇨🇱' },
    '98':   { op: 'Movistar Chile',     asn: 'AS27651',  subnet: '181.43',  rdns: '{ip}.mobile.movistar.cl',          tz: 'America/Santiago',                    country: 'Chile',        flag: '🇨🇱' },
    '99':   { op: 'Claro Chile',        asn: 'AS27882',  subnet: '200.72',  rdns: 'mobile-{ip}.claro.cl',             tz: 'America/Santiago',                    country: 'Chile',        flag: '🇨🇱' },
    '97':   { op: 'WOM Chile',          asn: 'AS263702', subnet: '190.248', rdns: '{ip}.wom.cl',                      tz: 'America/Santiago',                    country: 'Chile',        flag: '🇨🇱' },

    // ── BRASIL +55 ────────────────────────────
    '119':  { op: 'Vivo',               asn: 'AS26615',  subnet: '177.8',   rdns: '{ip}.dynamic.vivo.com.br',         tz: 'America/Sao_Paulo',                   country: 'Brasil',       flag: '🇧🇷' },
    '118':  { op: 'Claro Brasil',       asn: 'AS28573',  subnet: '177.66',  rdns: 'mobile-{ip}.claro.com.br',         tz: 'America/Sao_Paulo',                   country: 'Brasil',       flag: '🇧🇷' },
    '117':  { op: 'TIM Brasil',         asn: 'AS26599',  subnet: '187.0',   rdns: '{ip}.tim.com.br',                  tz: 'America/Sao_Paulo',                   country: 'Brasil',       flag: '🇧🇷' },
    '116':  { op: 'Oi',                 asn: 'AS7738',   subnet: '200.147', rdns: '{ip}.oi.net.br',                   tz: 'America/Sao_Paulo',                   country: 'Brasil',       flag: '🇧🇷' },

    // ── ECUADOR +593 ──────────────────────────
    '9939': { op: 'Claro Ecuador',      asn: 'AS27947',  subnet: '190.11',  rdns: 'mobile-{ip}.claro.net.ec',         tz: 'America/Guayaquil',                   country: 'Ecuador',      flag: '🇪🇨' },
    '9960': { op: 'Movistar Ecuador',   asn: 'AS27947',  subnet: '186.3',   rdns: '{ip}.movistar.net.ec',             tz: 'America/Guayaquil',                   country: 'Ecuador',      flag: '🇪🇨' },
    '9969': { op: 'CNT Ecuador',        asn: 'AS27947',  subnet: '190.95',  rdns: '{ip}.cnt.net.ec',                  tz: 'America/Guayaquil',                   country: 'Ecuador',      flag: '🇪🇨' },

    // ── BOLIVIA +591 ──────────────────────────
    '6910': { op: 'Tigo Bolivia',       asn: 'AS27882',  subnet: '190.129', rdns: '{ip}.tigo.bo',                     tz: 'America/La_Paz',                      country: 'Bolivia',      flag: '🇧🇴' },
    '7710': { op: 'Entel Bolivia',      asn: 'AS27882',  subnet: '179.6',   rdns: '{ip}.entel.bo',                    tz: 'America/La_Paz',                      country: 'Bolivia',      flag: '🇧🇴' },

    // ── PARAGUAY +595 ─────────────────────────
    '9610': { op: 'Tigo Paraguay',      asn: 'AS27882',  subnet: '200.85',  rdns: '{ip}.tigo.com.py',                 tz: 'America/Asuncion',                    country: 'Paraguay',     flag: '🇵🇾' },
    '9810': { op: 'Personal Paraguay',  asn: 'AS27882',  subnet: '200.40',  rdns: '{ip}.personal.com.py',             tz: 'America/Asuncion',                    country: 'Paraguay',     flag: '🇵🇾' },

    // ── URUGUAY +598 ──────────────────────────
    '9110': { op: 'Antel',              asn: 'AS6057',   subnet: '167.56',  rdns: '{ip}.antel.net.uy',                tz: 'America/Montevideo',                  country: 'Uruguay',      flag: '🇺🇾' },
    '9910': { op: 'Claro Uruguay',      asn: 'AS27843',  subnet: '190.5',   rdns: 'mobile-{ip}.claro.com.uy',         tz: 'America/Montevideo',                  country: 'Uruguay',      flag: '🇺🇾' },

    // ── PANAMÁ +507 ───────────────────────────
    '6000': { op: 'Claro Panamá',       asn: 'AS27843',  subnet: '181.211', rdns: 'mobile-{ip}.claro.com.pa',         tz: 'America/Panama',                      country: 'Panamá',       flag: '🇵🇦' },
    '6200': { op: 'Movistar Panamá',    asn: 'AS6503',   subnet: '190.34',  rdns: '{ip}.movistar.net.pa',             tz: 'America/Panama',                      country: 'Panamá',       flag: '🇵🇦' },

    // ── COSTA RICA +506 ───────────────────────
    '6000': { op: 'Kolbi',              asn: 'AS11297',  subnet: '201.192', rdns: '{ip}.ice.cr',                      tz: 'America/Costa_Rica',                  country: 'Costa Rica',   flag: '🇨🇷' },
    '7000': { op: 'Claro Costa Rica',   asn: 'AS27843',  subnet: '190.169', rdns: 'mobile-{ip}.claro.net.cr',         tz: 'America/Costa_Rica',                  country: 'Costa Rica',   flag: '🇨🇷' },

    // ── GUATEMALA +502 ────────────────────────
    '4000': { op: 'Tigo Guatemala',     asn: 'AS27882',  subnet: '190.111', rdns: '{ip}.tigo.com.gt',                 tz: 'America/Guatemala',                   country: 'Guatemala',    flag: '🇬🇹' },
    '5000': { op: 'Claro Guatemala',    asn: 'AS27843',  subnet: '181.112', rdns: 'mobile-{ip}.claro.net.gt',         tz: 'America/Guatemala',                   country: 'Guatemala',    flag: '🇬🇹' },

    // ── HONDURAS +504 ─────────────────────────
    '3000': { op: 'Tigo Honduras',      asn: 'AS27882',  subnet: '190.7',   rdns: '{ip}.tigo.hn',                     tz: 'America/Tegucigalpa',                 country: 'Honduras',     flag: '🇭🇳' },
    '9000': { op: 'Claro Honduras',     asn: 'AS27843',  subnet: '181.176', rdns: 'mobile-{ip}.claro.net.hn',         tz: 'America/Tegucigalpa',                 country: 'Honduras',     flag: '🇭🇳' },

    // ── EL SALVADOR +503 ──────────────────────
    '7000': { op: 'Tigo El Salvador',   asn: 'AS27882',  subnet: '190.88',  rdns: '{ip}.tigo.net.sv',                 tz: 'America/El_Salvador',                 country: 'El Salvador',  flag: '🇸🇻' },
    '7900': { op: 'Claro El Salvador',  asn: 'AS27843',  subnet: '190.150', rdns: 'mobile-{ip}.claro.net.sv',         tz: 'America/El_Salvador',                 country: 'El Salvador',  flag: '🇸🇻' },

    // ── NICARAGUA +505 ────────────────────────
    '8000': { op: 'Claro Nicaragua',    asn: 'AS27843',  subnet: '186.130', rdns: 'mobile-{ip}.claro.net.ni',         tz: 'America/Managua',                     country: 'Nicaragua',    flag: '🇳🇮' },
    '8500': { op: 'Movistar Nicaragua', asn: 'AS6503',   subnet: '190.213', rdns: '{ip}.movistar.net.ni',             tz: 'America/Managua',                     country: 'Nicaragua',    flag: '🇳🇮' },

    // ── REPÚBLICA DOMINICANA +1809 ────────────
    '809':  { op: 'Claro RD',           asn: 'AS27843',  subnet: '186.15',  rdns: 'mobile-{ip}.claro.net.do',         tz: 'America/Santo_Domingo',               country: 'Rep. Dominicana', flag: '🇩🇴' },
    '829':  { op: 'Altice RD',          asn: 'AS27882',  subnet: '190.47',  rdns: '{ip}.altice.net.do',               tz: 'America/Santo_Domingo',               country: 'Rep. Dominicana', flag: '🇩🇴' },

    // ── CUBA +53 ──────────────────────────────
    '5000': { op: 'ETECSA',             asn: 'AS27725',  subnet: '152.206', rdns: '{ip}.etecsa.cu',                   tz: 'America/Havana',                      country: 'Cuba',         flag: '🇨🇺' },

    // ══════════════════════════════════════════
    //   NORTEAMÉRICA
    // ══════════════════════════════════════════

    // ── ESTADOS UNIDOS +1 ─────────────────────
    '201':  { op: 'AT&T',               asn: 'AS7018',   subnet: '72.229',  rdns: '{ip}.sbcglobal.net',               tz: 'America/New_York',                    country: 'Estados Unidos', flag: '🇺🇸' },
    '202':  { op: 'Verizon',            asn: 'AS701',    subnet: '174.205', rdns: '{ip}.vzwentp.net',                 tz: 'America/New_York',                    country: 'Estados Unidos', flag: '🇺🇸' },
    '212':  { op: 'T-Mobile',           asn: 'AS21928',  subnet: '172.56',  rdns: '{ip}.tmo.net',                     tz: 'America/New_York',                    country: 'Estados Unidos', flag: '🇺🇸' },
    '213':  { op: 'Comcast',            asn: 'AS7922',   subnet: '76.89',   rdns: '{ip}.dynamic.comcast.net',         tz: 'America/Los_Angeles',                 country: 'Estados Unidos', flag: '🇺🇸' },
    '305':  { op: 'Spectrum',           asn: 'AS7922',   subnet: '98.116',  rdns: '{ip}.dynamic.spectrum.net',        tz: 'America/New_York',                    country: 'Estados Unidos', flag: '🇺🇸' },

    // ── CANADÁ +1 ─────────────────────────────
    '416':  { op: 'Rogers',             asn: 'AS812',    subnet: '99.228',  rdns: '{ip}.dynamic.rogers.com',          tz: 'America/Toronto',                     country: 'Canadá',       flag: '🇨🇦' },
    '604':  { op: 'Telus',              asn: 'AS852',    subnet: '69.196',  rdns: '{ip}.telus.net',                   tz: 'America/Vancouver',                   country: 'Canadá',       flag: '🇨🇦' },
    '514':  { op: 'Bell Canada',        asn: 'AS577',    subnet: '70.52',   rdns: '{ip}.bell.ca',                     tz: 'America/Toronto',                     country: 'Canadá',       flag: '🇨🇦' },

    // ══════════════════════════════════════════
    //   EUROPA
    // ══════════════════════════════════════════

    // ── ESPAÑA +34 ────────────────────────────
    '6':    { op: 'Movistar España',    asn: 'AS3352',   subnet: '81.33',   rdns: '{ip}.mobile.movistar.net',         tz: 'Europe/Madrid',                       country: 'España',       flag: '🇪🇸' },
    '61':   { op: 'Vodafone España',    asn: 'AS12430',  subnet: '88.6',    rdns: '{ip}.dynamic.vodafone.es',         tz: 'Europe/Madrid',                       country: 'España',       flag: '🇪🇸' },
    '62':   { op: 'Orange España',      asn: 'AS12479',  subnet: '90.168',  rdns: '{ip}.orange.es',                   tz: 'Europe/Madrid',                       country: 'España',       flag: '🇪🇸' },
    '63':   { op: 'MásMóvil',           asn: 'AS57269',  subnet: '217.127', rdns: '{ip}.masmovil.es',                 tz: 'Europe/Madrid',                       country: 'España',       flag: '🇪🇸' },

    // ── REINO UNIDO +44 ───────────────────────
    '74':   { op: 'EE',                 asn: 'AS12576',  subnet: '86.3',    rdns: '{ip}.mobile.ee.co.uk',             tz: 'Europe/London',                       country: 'Reino Unido',  flag: '🇬🇧' },
    '75':   { op: 'O2 UK',              asn: 'AS13285',  subnet: '90.218',  rdns: '{ip}.o2mobile.co.uk',              tz: 'Europe/London',                       country: 'Reino Unido',  flag: '🇬🇧' },
    '77':   { op: 'Vodafone UK',        asn: 'AS1273',   subnet: '82.44',   rdns: '{ip}.dynamic.vodafone.co.uk',      tz: 'Europe/London',                       country: 'Reino Unido',  flag: '🇬🇧' },
    '78':   { op: 'Three UK',           asn: 'AS31655',  subnet: '109.145', rdns: '{ip}.three.co.uk',                 tz: 'Europe/London',                       country: 'Reino Unido',  flag: '🇬🇧' },

    // ── ALEMANIA +49 ──────────────────────────
    '151':  { op: 'Telekom DE',         asn: 'AS3320',   subnet: '80.187',  rdns: '{ip}.p80.pool.t-dialin.net',       tz: 'Europe/Berlin',                       country: 'Alemania',     flag: '🇩🇪' },
    '152':  { op: 'Vodafone DE',        asn: 'AS3209',   subnet: '79.242',  rdns: '{ip}.dynamic.vodafone.de',         tz: 'Europe/Berlin',                       country: 'Alemania',     flag: '🇩🇪' },
    '157':  { op: 'O2 DE',              asn: 'AS8422',   subnet: '84.190',  rdns: '{ip}.o2online.de',                 tz: 'Europe/Berlin',                       country: 'Alemania',     flag: '🇩🇪' },

    // ── FRANCIA +33 ───────────────────────────
    '6':    { op: 'Orange FR',          asn: 'AS5410',   subnet: '90.50',   rdns: '{ip}.rev.numericable.fr',          tz: 'Europe/Paris',                        country: 'Francia',      flag: '🇫🇷' },
    '7':    { op: 'SFR',                asn: 'AS15557',  subnet: '88.185',  rdns: '{ip}.fbx.proxad.net',              tz: 'Europe/Paris',                        country: 'Francia',      flag: '🇫🇷' },

    // ── ITALIA +39 ────────────────────────────
    '320':  { op: 'Wind Tre',           asn: 'AS1267',   subnet: '151.53',  rdns: '{ip}.wind.net.it',                 tz: 'Europe/Rome',                         country: 'Italia',       flag: '🇮🇹' },
    '330':  { op: 'Vodafone IT',        asn: 'AS30722',  subnet: '93.63',   rdns: '{ip}.mobile.vodafone.it',          tz: 'Europe/Rome',                         country: 'Italia',       flag: '🇮🇹' },
    '340':  { op: 'TIM Italia',         asn: 'AS1267',   subnet: '79.20',   rdns: '{ip}.tim.it',                      tz: 'Europe/Rome',                         country: 'Italia',       flag: '🇮🇹' },

    // ── PORTUGAL +351 ─────────────────────────
    '91':   { op: 'Vodafone PT',        asn: 'AS12353',  subnet: '213.13',  rdns: '{ip}.dynamic.vodafone.pt',         tz: 'Europe/Lisbon',                       country: 'Portugal',     flag: '🇵🇹' },
    '93':   { op: 'NOS Portugal',       asn: 'AS8657',   subnet: '194.210', rdns: '{ip}.nos.pt',                      tz: 'Europe/Lisbon',                       country: 'Portugal',     flag: '🇵🇹' },
    '96':   { op: 'MEO Portugal',       asn: 'AS5432',   subnet: '85.243',  rdns: '{ip}.meo.pt',                      tz: 'Europe/Lisbon',                       country: 'Portugal',     flag: '🇵🇹' },

    // ── HOLANDA +31 ───────────────────────────
    '6':    { op: 'KPN Nederland',      asn: 'AS1136',   subnet: '84.105',  rdns: '{ip}.dynamic.kpn.net',             tz: 'Europe/Amsterdam',                    country: 'Países Bajos', flag: '🇳🇱' },

    // ── BÉLGICA +32 ───────────────────────────
    '47':   { op: 'Proximus',           asn: 'AS5432',   subnet: '81.246',  rdns: '{ip}.proximus.be',                 tz: 'Europe/Brussels',                     country: 'Bélgica',      flag: '🇧🇪' },
    '49':   { op: 'Orange Bélgica',     asn: 'AS12392',  subnet: '91.182',  rdns: '{ip}.orange.be',                   tz: 'Europe/Brussels',                     country: 'Bélgica',      flag: '🇧🇪' },

    // ── SUIZA +41 ─────────────────────────────
    '76':   { op: 'Sunrise CH',         asn: 'AS6730',   subnet: '178.197', rdns: '{ip}.sunrise.ch',                  tz: 'Europe/Zurich',                       country: 'Suiza',        flag: '🇨🇭' },
    '79':   { op: 'Swisscom',           asn: 'AS3303',   subnet: '85.2',    rdns: '{ip}.static.swisscom.ch',          tz: 'Europe/Zurich',                       country: 'Suiza',        flag: '🇨🇭' },

    // ── SUECIA +46 ────────────────────────────
    '70':   { op: 'Tele2 SE',           asn: 'AS1257',   subnet: '83.233',  rdns: '{ip}.tele2.net',                   tz: 'Europe/Stockholm',                    country: 'Suecia',       flag: '🇸🇪' },
    '73':   { op: 'Telia SE',           asn: 'AS3301',   subnet: '62.109',  rdns: '{ip}.telia.com',                   tz: 'Europe/Stockholm',                    country: 'Suecia',       flag: '🇸🇪' },

    // ── NORUEGA +47 ───────────────────────────
    '4':    { op: 'Telenor NO',         asn: 'AS2119',   subnet: '84.208',  rdns: '{ip}.telenor.net',                 tz: 'Europe/Oslo',                         country: 'Noruega',      flag: '🇳🇴' },
    '9':    { op: 'Telia NO',           asn: 'AS3301',   subnet: '195.159', rdns: '{ip}.telia.no',                    tz: 'Europe/Oslo',                         country: 'Noruega',      flag: '🇳🇴' },

    // ── DINAMARCA +45 ─────────────────────────
    '2':    { op: 'TDC DK',             asn: 'AS3292',   subnet: '80.62',   rdns: '{ip}.tdc.dk',                      tz: 'Europe/Copenhagen',                   country: 'Dinamarca',    flag: '🇩🇰' },
    '3':    { op: 'Telenor DK',         asn: 'AS2119',   subnet: '93.176',  rdns: '{ip}.telenor.dk',                  tz: 'Europe/Copenhagen',                   country: 'Dinamarca',    flag: '🇩🇰' },

    // ── RUSIA +7 ──────────────────────────────
    '900':  { op: 'MTS Russia',         asn: 'AS8359',   subnet: '178.140', rdns: '{ip}.dynamic.mts.ru',              tz: 'Europe/Moscow',                       country: 'Rusia',        flag: '🇷🇺' },
    '901':  { op: 'Beeline RU',         asn: 'AS3216',   subnet: '109.252', rdns: '{ip}.static.vimpelcom.ru',         tz: 'Europe/Moscow',                       country: 'Rusia',        flag: '🇷🇺' },
    '916':  { op: 'MegaFon',            asn: 'AS31133',  subnet: '94.25',   rdns: '{ip}.megafon.net',                 tz: 'Europe/Moscow',                       country: 'Rusia',        flag: '🇷🇺' },
    '999':  { op: 'Tele2 RU',           asn: 'AS1257',   subnet: '95.31',   rdns: '{ip}.tele2.ru',                    tz: 'Europe/Moscow',                       country: 'Rusia',        flag: '🇷🇺' },

    // ── UCRANIA +380 ──────────────────────────
    '50':   { op: 'Vodafone UA',        asn: 'AS21497',  subnet: '93.72',   rdns: '{ip}.vodafone.ua',                 tz: 'Europe/Kyiv',                         country: 'Ucrania',      flag: '🇺🇦' },
    '63':   { op: 'Lifecell UA',        asn: 'AS21497',  subnet: '37.52',   rdns: '{ip}.lifecell.com.ua',             tz: 'Europe/Kyiv',                         country: 'Ucrania',      flag: '🇺🇦' },
    '67':   { op: 'Kyivstar',           asn: 'AS15895',  subnet: '176.36',  rdns: '{ip}.kyivstar.net',                tz: 'Europe/Kyiv',                         country: 'Ucrania',      flag: '🇺🇦' },

    // ── POLONIA +48 ───────────────────────────
    '50':   { op: 'Orange PL',          asn: 'AS5617',   subnet: '83.24',   rdns: '{ip}.neoplus.adsl.tpnet.pl',       tz: 'Europe/Warsaw',                       country: 'Polonia',      flag: '🇵🇱' },
    '60':   { op: 'Play PL',            asn: 'AS39603',  subnet: '79.184',  rdns: '{ip}.play.pl',                     tz: 'Europe/Warsaw',                       country: 'Polonia',      flag: '🇵🇱' },
    '66':   { op: 'T-Mobile PL',        asn: 'AS12912',  subnet: '87.205',  rdns: '{ip}.t-mobile.pl',                 tz: 'Europe/Warsaw',                       country: 'Polonia',      flag: '🇵🇱' },

    // ══════════════════════════════════════════
    //   ASIA
    // ══════════════════════════════════════════

    // ── CHINA +86 ─────────────────────────────
    '130':  { op: 'China Mobile',       asn: 'AS9808',   subnet: '117.136', rdns: '{ip}.mobile.chinamobile.com',      tz: 'Asia/Shanghai',                       country: 'China',        flag: '🇨🇳' },
    '131':  { op: 'China Mobile',       asn: 'AS9808',   subnet: '117.137', rdns: '{ip}.mobile.chinamobile.com',      tz: 'Asia/Shanghai',                       country: 'China',        flag: '🇨🇳' },
    '153':  { op: 'China Unicom',       asn: 'AS4837',   subnet: '116.7',   rdns: '{ip}.unicom.cn',                   tz: 'Asia/Shanghai',                       country: 'China',        flag: '🇨🇳' },
    '177':  { op: 'China Telecom',      asn: 'AS4134',   subnet: '113.88',  rdns: '{ip}.telecom.cn',                  tz: 'Asia/Shanghai',                       country: 'China',        flag: '🇨🇳' },

    // ── JAPÓN +81 ─────────────────────────────
    '70':   { op: 'NTT Docomo',         asn: 'AS9605',   subnet: '111.107', rdns: '{ip}.spmode.ne.jp',                tz: 'Asia/Tokyo',                          country: 'Japón',        flag: '🇯🇵' },
    '80':   { op: 'SoftBank JP',        asn: 'AS17676',  subnet: '126.65',  rdns: '{ip}.softbank.ne.jp',              tz: 'Asia/Tokyo',                          country: 'Japón',        flag: '🇯🇵' },
    '90':   { op: 'au KDDI',            asn: 'AS2527',   subnet: '106.130', rdns: '{ip}.au-net.ne.jp',                tz: 'Asia/Tokyo',                          country: 'Japón',        flag: '🇯🇵' },

    // ── COREA DEL SUR +82 ─────────────────────
    '10':   { op: 'SKT Korea',          asn: 'AS9644',   subnet: '114.206', rdns: '{ip}.sktelecom.com',               tz: 'Asia/Seoul',                          country: 'Corea del Sur',flag: '🇰🇷' },
    '16':   { op: 'KT Korea',           asn: 'AS4766',   subnet: '125.186', rdns: '{ip}.kt.com',                      tz: 'Asia/Seoul',                          country: 'Corea del Sur',flag: '🇰🇷' },
    '19':   { op: 'LG Uplus',           asn: 'AS17858',  subnet: '119.207', rdns: '{ip}.lguplus.co.kr',               tz: 'Asia/Seoul',                          country: 'Corea del Sur',flag: '🇰🇷' },

    // ── INDIA +91 ─────────────────────────────
    '70':   { op: 'Jio India',          asn: 'AS55836',  subnet: '49.36',   rdns: '{ip}.jio.com',                     tz: 'Asia/Kolkata',                        country: 'India',        flag: '🇮🇳' },
    '80':   { op: 'Airtel India',       asn: 'AS24560',  subnet: '122.172', rdns: '{ip}.airtel.in',                   tz: 'Asia/Kolkata',                        country: 'India',        flag: '🇮🇳' },
    '90':   { op: 'Vi India',           asn: 'AS55410',  subnet: '117.193', rdns: '{ip}.vodafone.in',                 tz: 'Asia/Kolkata',                        country: 'India',        flag: '🇮🇳' },
    '98':   { op: 'BSNL India',         asn: 'AS9829',   subnet: '117.97',  rdns: '{ip}.bsnl.in',                     tz: 'Asia/Kolkata',                        country: 'India',        flag: '🇮🇳' },

    // ── INDONESIA +62 ─────────────────────────
    '811':  { op: 'Telkomsel',          asn: 'AS23693',  subnet: '114.125', rdns: '{ip}.telkomsel.net.id',            tz: 'Asia/Jakarta',                        country: 'Indonesia',    flag: '🇮🇩' },
    '851':  { op: 'Indosat',            asn: 'AS4761',   subnet: '110.136', rdns: '{ip}.indosatm2.com',               tz: 'Asia/Jakarta',                        country: 'Indonesia',    flag: '🇮🇩' },
    '896':  { op: 'XL Axiata',          asn: 'AS24203',  subnet: '36.68',   rdns: '{ip}.xl.co.id',                    tz: 'Asia/Jakarta',                        country: 'Indonesia',    flag: '🇮🇩' },

    // ── PAKISTÁN +92 ──────────────────────────
    '300':  { op: 'Jazz PK',            asn: 'AS45669',  subnet: '103.255', rdns: '{ip}.jazz.com.pk',                 tz: 'Asia/Karachi',                        country: 'Pakistán',     flag: '🇵🇰' },
    '310':  { op: 'Zong PK',            asn: 'AS38193',  subnet: '182.182', rdns: '{ip}.zong.com.pk',                 tz: 'Asia/Karachi',                        country: 'Pakistán',     flag: '🇵🇰' },
    '320':  { op: 'Telenor PK',         asn: 'AS38264',  subnet: '103.18',  rdns: '{ip}.telenor.com.pk',              tz: 'Asia/Karachi',                        country: 'Pakistán',     flag: '🇵🇰' },

    // ── FILIPINAS +63 ─────────────────────────
    '905':  { op: 'Globe PH',           asn: 'AS4775',   subnet: '112.198', rdns: '{ip}.globe.com.ph',                tz: 'Asia/Manila',                         country: 'Filipinas',    flag: '🇵🇭' },
    '917':  { op: 'Globe PH',           asn: 'AS4775',   subnet: '180.190', rdns: '{ip}.globe.com.ph',                tz: 'Asia/Manila',                         country: 'Filipinas',    flag: '🇵🇭' },
    '919':  { op: 'Smart PH',           asn: 'AS9658',   subnet: '120.28',  rdns: '{ip}.smart.com.ph',                tz: 'Asia/Manila',                         country: 'Filipinas',    flag: '🇵🇭' },

    // ── TAILANDIA +66 ─────────────────────────
    '81':   { op: 'AIS Thailand',       asn: 'AS131090', subnet: '171.96',  rdns: '{ip}.ais.th',                      tz: 'Asia/Bangkok',                        country: 'Tailandia',    flag: '🇹🇭' },
    '85':   { op: 'DTAC Thailand',      asn: 'AS9931',   subnet: '171.7',   rdns: '{ip}.dtac.net',                    tz: 'Asia/Bangkok',                        country: 'Tailandia',    flag: '🇹🇭' },

    // ── ARABIA SAUDITA +966 ───────────────────
    '50':   { op: 'STC Saudi',          asn: 'AS25019',  subnet: '188.50',  rdns: '{ip}.stc.com.sa',                  tz: 'Asia/Riyadh',                         country: 'Arabia Saudita',flag: '🇸🇦' },
    '55':   { op: 'Mobily SA',          asn: 'AS39386',  subnet: '188.55',  rdns: '{ip}.mobily.net.sa',               tz: 'Asia/Riyadh',                         country: 'Arabia Saudita',flag: '🇸🇦' },
    '58':   { op: 'Zain SA',            asn: 'AS47589',  subnet: '46.32',   rdns: '{ip}.zain.com',                    tz: 'Asia/Riyadh',                         country: 'Arabia Saudita',flag: '🇸🇦' },

    // ── EMIRATOS ÁRABES +971 ──────────────────
    '50':   { op: 'Etisalat UAE',       asn: 'AS5384',   subnet: '94.204',  rdns: '{ip}.etisalat.ae',                 tz: 'Asia/Dubai',                          country: 'Emiratos Árabes', flag: '🇦🇪' },
    '55':   { op: 'du UAE',             asn: 'AS15802',  subnet: '91.74',   rdns: '{ip}.du.ae',                       tz: 'Asia/Dubai',                          country: 'Emiratos Árabes', flag: '🇦🇪' },

    // ── TURQUÍA +90 ───────────────────────────
    '530':  { op: 'Turkcell',           asn: 'AS47524',  subnet: '88.229',  rdns: '{ip}.turkcell.com.tr',             tz: 'Europe/Istanbul',                     country: 'Turquía',      flag: '🇹🇷' },
    '542':  { op: 'Vodafone TR',        asn: 'AS15897',  subnet: '95.14',   rdns: '{ip}.vodafone.com.tr',             tz: 'Europe/Istanbul',                     country: 'Turquía',      flag: '🇹🇷' },
    '505':  { op: 'Türk Telekom',       asn: 'AS9121',   subnet: '78.162',  rdns: '{ip}.ttnet.com.tr',                tz: 'Europe/Istanbul',                     country: 'Turquía',      flag: '🇹🇷' },

    // ══════════════════════════════════════════
    //   AFRICA
    // ══════════════════════════════════════════

    // ── NIGERIA +234 ──────────────────────────
    '802':  { op: 'MTN Nigeria',        asn: 'AS37282',  subnet: '197.210', rdns: '{ip}.mtn.com.ng',                  tz: 'Africa/Lagos',                        country: 'Nigeria',      flag: '🇳🇬' },
    '805':  { op: 'Glo Nigeria',        asn: 'AS29465',  subnet: '197.211', rdns: '{ip}.gloworld.com',                tz: 'Africa/Lagos',                        country: 'Nigeria',      flag: '🇳🇬' },
    '809':  { op: 'Airtel Nigeria',     asn: 'AS36873',  subnet: '41.203',  rdns: '{ip}.airtelng.com',                tz: 'Africa/Lagos',                        country: 'Nigeria',      flag: '🇳🇬' },

    // ── SUDÁFRICA +27 ─────────────────────────
    '71':   { op: 'Vodacom ZA',         asn: 'AS36874',  subnet: '41.13',   rdns: '{ip}.vodacom.co.za',               tz: 'Africa/Johannesburg',                 country: 'Sudáfrica',    flag: '🇿🇦' },
    '73':   { op: 'MTN ZA',             asn: 'AS16637',  subnet: '196.25',  rdns: '{ip}.mtn.co.za',                   tz: 'Africa/Johannesburg',                 country: 'Sudáfrica',    flag: '🇿🇦' },
    '82':   { op: 'Telkom ZA',          asn: 'AS10474',  subnet: '197.184', rdns: '{ip}.telkomsa.net',                tz: 'Africa/Johannesburg',                 country: 'Sudáfrica',    flag: '🇿🇦' },

    // ── KENIA +254 ────────────────────────────
    '700':  { op: 'Safaricom',          asn: 'AS33771',  subnet: '196.201', rdns: '{ip}.safaricom.net',               tz: 'Africa/Nairobi',                      country: 'Kenia',        flag: '🇰🇪' },
    '720':  { op: 'Airtel Kenya',       asn: 'AS36873',  subnet: '41.90',   rdns: '{ip}.airtel.com',                  tz: 'Africa/Nairobi',                      country: 'Kenia',        flag: '🇰🇪' },

    // ── GHANA +233 ────────────────────────────
    '24':   { op: 'MTN Ghana',          asn: 'AS29614',  subnet: '154.160', rdns: '{ip}.mtn.com.gh',                  tz: 'Africa/Accra',                        country: 'Ghana',        flag: '🇬🇭' },
    '55':   { op: 'Vodafone GH',        asn: 'AS36914',  subnet: '41.66',   rdns: '{ip}.vodafone.com.gh',             tz: 'Africa/Accra',                        country: 'Ghana',        flag: '🇬🇭' },

    // ── EGIPTO +20 ────────────────────────────
    '10':   { op: 'Mobinil EG',         asn: 'AS24835',  subnet: '41.235',  rdns: '{ip}.mobinil.net',                 tz: 'Africa/Cairo',                        country: 'Egipto',       flag: '🇪🇬' },
    '11':   { op: 'Vodafone EG',        asn: 'AS36935',  subnet: '196.219', rdns: '{ip}.vodafone.com.eg',             tz: 'Africa/Cairo',                        country: 'Egipto',       flag: '🇪🇬' },
    '12':   { op: 'Etisalat EG',        asn: 'AS36992',  subnet: '197.32',  rdns: '{ip}.etisalat.com.eg',             tz: 'Africa/Cairo',                        country: 'Egipto',       flag: '🇪🇬' },

    // ══════════════════════════════════════════
    //   OCEANÍA
    // ══════════════════════════════════════════

    // ── AUSTRALIA +61 ─────────────────────────
    '400':  { op: 'Telstra AU',         asn: 'AS1221',   subnet: '101.160', rdns: '{ip}.tpgi.com.au',                 tz: 'Australia/Sydney',                    country: 'Australia',    flag: '🇦🇺' },
    '411':  { op: 'Optus AU',           asn: 'AS4804',   subnet: '49.183',  rdns: '{ip}.optusnet.com.au',             tz: 'Australia/Sydney',                    country: 'Australia',    flag: '🇦🇺' },
    '420':  { op: 'Vodafone AU',        asn: 'AS38804',  subnet: '101.161', rdns: '{ip}.vodafone.net.au',             tz: 'Australia/Sydney',                    country: 'Australia',    flag: '🇦🇺' },

    // ── NUEVA ZELANDA +64 ─────────────────────
    '21':   { op: 'Vodafone NZ',        asn: 'AS9500',   subnet: '121.98',  rdns: '{ip}.vodafone.co.nz',              tz: 'Pacific/Auckland',                    country: 'Nueva Zelanda',flag: '🇳🇿' },
    '27':   { op: 'Spark NZ',           asn: 'AS4771',   subnet: '125.239', rdns: '{ip}.spark.co.nz',                 tz: 'Pacific/Auckland',                    country: 'Nueva Zelanda',flag: '🇳🇿' },
}

// Fallback por código de país (cuando no matchea prefijo local)
const COUNTRY_FALLBACK = {
    '57':  { op: 'Claro Colombia',     asn: 'AS13489',  subnet: '181.49',  rdns: 'mobile-{ip}.claro.net.co',         tz: 'America/Bogota',                      country: 'Colombia',        flag: '🇨🇴' },
    '52':  { op: 'Telcel',             asn: 'AS8151',   subnet: '187.141', rdns: '{ip}.mobile.telcel.com',           tz: 'America/Mexico_City',                 country: 'México',          flag: '🇲🇽' },
    '58':  { op: 'Movistar Venezuela', asn: 'AS6306',   subnet: '190.202', rdns: '{ip}.movistar.net.ve',             tz: 'America/Caracas',                     country: 'Venezuela',       flag: '🇻🇪' },
    '51':  { op: 'Claro Perú',         asn: 'AS27843',  subnet: '181.65',  rdns: 'mobile-{ip}.claro.net.pe',         tz: 'America/Lima',                        country: 'Perú',            flag: '🇵🇪' },
    '54':  { op: 'Personal',           asn: 'AS22927',  subnet: '181.10',  rdns: '{ip}.gprs.personal.com.ar',        tz: 'America/Argentina/Buenos_Aires',      country: 'Argentina',       flag: '🇦🇷' },
    '56':  { op: 'Entel Chile',        asn: 'AS22047',  subnet: '190.98',  rdns: '{ip}.dynamic.entel.cl',            tz: 'America/Santiago',                    country: 'Chile',           flag: '🇨🇱' },
    '55':  { op: 'Vivo',               asn: 'AS26615',  subnet: '177.8',   rdns: '{ip}.dynamic.vivo.com.br',         tz: 'America/Sao_Paulo',                   country: 'Brasil',          flag: '🇧🇷' },
    '593': { op: 'Claro Ecuador',      asn: 'AS27947',  subnet: '190.11',  rdns: 'mobile-{ip}.claro.net.ec',         tz: 'America/Guayaquil',                   country: 'Ecuador',         flag: '🇪🇨' },
    '591': { op: 'Tigo Bolivia',       asn: 'AS27882',  subnet: '190.129', rdns: '{ip}.tigo.bo',                     tz: 'America/La_Paz',                      country: 'Bolivia',         flag: '🇧🇴' },
    '595': { op: 'Tigo Paraguay',      asn: 'AS27882',  subnet: '200.85',  rdns: '{ip}.tigo.com.py',                 tz: 'America/Asuncion',                    country: 'Paraguay',        flag: '🇵🇾' },
    '598': { op: 'Antel',              asn: 'AS6057',   subnet: '167.56',  rdns: '{ip}.antel.net.uy',                tz: 'America/Montevideo',                  country: 'Uruguay',         flag: '🇺🇾' },
    '507': { op: 'Claro Panamá',       asn: 'AS27843',  subnet: '181.211', rdns: 'mobile-{ip}.claro.com.pa',         tz: 'America/Panama',                      country: 'Panamá',          flag: '🇵🇦' },
    '506': { op: 'Kolbi',              asn: 'AS11297',  subnet: '201.192', rdns: '{ip}.ice.cr',                      tz: 'America/Costa_Rica',                  country: 'Costa Rica',      flag: '🇨🇷' },
    '502': { op: 'Tigo Guatemala',     asn: 'AS27882',  subnet: '190.111', rdns: '{ip}.tigo.com.gt',                 tz: 'America/Guatemala',                   country: 'Guatemala',       flag: '🇬🇹' },
    '504': { op: 'Tigo Honduras',      asn: 'AS27882',  subnet: '190.7',   rdns: '{ip}.tigo.hn',                     tz: 'America/Tegucigalpa',                 country: 'Honduras',        flag: '🇭🇳' },
    '503': { op: 'Tigo El Salvador',   asn: 'AS27882',  subnet: '190.88',  rdns: '{ip}.tigo.net.sv',                 tz: 'America/El_Salvador',                 country: 'El Salvador',     flag: '🇸🇻' },
    '505': { op: 'Claro Nicaragua',    asn: 'AS27843',  subnet: '186.130', rdns: 'mobile-{ip}.claro.net.ni',         tz: 'America/Managua',                     country: 'Nicaragua',       flag: '🇳🇮' },
    '1':   { op: 'AT&T',               asn: 'AS7018',   subnet: '72.229',  rdns: '{ip}.sbcglobal.net',               tz: 'America/New_York',                    country: 'Estados Unidos',  flag: '🇺🇸' },
    '44':  { op: 'EE',                 asn: 'AS12576',  subnet: '86.3',    rdns: '{ip}.mobile.ee.co.uk',             tz: 'Europe/London',                       country: 'Reino Unido',     flag: '🇬🇧' },
    '34':  { op: 'Movistar España',    asn: 'AS3352',   subnet: '81.33',   rdns: '{ip}.mobile.movistar.net',         tz: 'Europe/Madrid',                       country: 'España',          flag: '🇪🇸' },
    '49':  { op: 'Telekom DE',         asn: 'AS3320',   subnet: '80.187',  rdns: '{ip}.t-dialin.net',                tz: 'Europe/Berlin',                       country: 'Alemania',        flag: '🇩🇪' },
    '33':  { op: 'Orange FR',          asn: 'AS5410',   subnet: '90.50',   rdns: '{ip}.orange.fr',                   tz: 'Europe/Paris',                        country: 'Francia',         flag: '🇫🇷' },
    '39':  { op: 'TIM Italia',         asn: 'AS1267',   subnet: '79.20',   rdns: '{ip}.tim.it',                      tz: 'Europe/Rome',                         country: 'Italia',          flag: '🇮🇹' },
    '351': { op: 'MEO Portugal',       asn: 'AS5432',   subnet: '85.243',  rdns: '{ip}.meo.pt',                      tz: 'Europe/Lisbon',                       country: 'Portugal',        flag: '🇵🇹' },
    '7':   { op: 'MTS Russia',         asn: 'AS8359',   subnet: '178.140', rdns: '{ip}.dynamic.mts.ru',              tz: 'Europe/Moscow',                       country: 'Rusia',           flag: '🇷🇺' },
    '380': { op: 'Kyivstar',           asn: 'AS15895',  subnet: '176.36',  rdns: '{ip}.kyivstar.net',                tz: 'Europe/Kyiv',                         country: 'Ucrania',         flag: '🇺🇦' },
    '86':  { op: 'China Mobile',       asn: 'AS9808',   subnet: '117.136', rdns: '{ip}.mobile.chinamobile.com',      tz: 'Asia/Shanghai',                       country: 'China',           flag: '🇨🇳' },
    '81':  { op: 'NTT Docomo',         asn: 'AS9605',   subnet: '111.107', rdns: '{ip}.spmode.ne.jp',                tz: 'Asia/Tokyo',                          country: 'Japón',           flag: '🇯🇵' },
    '82':  { op: 'SKT Korea',          asn: 'AS9644',   subnet: '114.206', rdns: '{ip}.sktelecom.com',               tz: 'Asia/Seoul',                          country: 'Corea del Sur',   flag: '🇰🇷' },
    '91':  { op: 'Jio India',          asn: 'AS55836',  subnet: '49.36',   rdns: '{ip}.jio.com',                     tz: 'Asia/Kolkata',                        country: 'India',           flag: '🇮🇳' },
    '62':  { op: 'Telkomsel',          asn: 'AS23693',  subnet: '114.125', rdns: '{ip}.telkomsel.net.id',            tz: 'Asia/Jakarta',                        country: 'Indonesia',       flag: '🇮🇩' },
    '92':  { op: 'Jazz PK',            asn: 'AS45669',  subnet: '103.255', rdns: '{ip}.jazz.com.pk',                 tz: 'Asia/Karachi',                        country: 'Pakistán',        flag: '🇵🇰' },
    '63':  { op: 'Globe PH',           asn: 'AS4775',   subnet: '112.198', rdns: '{ip}.globe.com.ph',                tz: 'Asia/Manila',                         country: 'Filipinas',       flag: '🇵🇭' },
    '66':  { op: 'AIS Thailand',       asn: 'AS131090', subnet: '171.96',  rdns: '{ip}.ais.th',                      tz: 'Asia/Bangkok',                        country: 'Tailandia',       flag: '🇹🇭' },
    '966': { op: 'STC Saudi',          asn: 'AS25019',  subnet: '188.50',  rdns: '{ip}.stc.com.sa',                  tz: 'Asia/Riyadh',                         country: 'Arabia Saudita',  flag: '🇸🇦' },
    '971': { op: 'Etisalat UAE',       asn: 'AS5384',   subnet: '94.204',  rdns: '{ip}.etisalat.ae',                 tz: 'Asia/Dubai',                          country: 'Emiratos Árabes', flag: '🇦🇪' },
    '90':  { op: 'Turkcell',           asn: 'AS47524',  subnet: '88.229',  rdns: '{ip}.turkcell.com.tr',             tz: 'Europe/Istanbul',                     country: 'Turquía',         flag: '🇹🇷' },
    '234': { op: 'MTN Nigeria',        asn: 'AS37282',  subnet: '197.210', rdns: '{ip}.mtn.com.ng',                  tz: 'Africa/Lagos',                        country: 'Nigeria',         flag: '🇳🇬' },
    '27':  { op: 'Vodacom ZA',         asn: 'AS36874',  subnet: '41.13',   rdns: '{ip}.vodacom.co.za',               tz: 'Africa/Johannesburg',                 country: 'Sudáfrica',       flag: '🇿🇦' },
    '254': { op: 'Safaricom',          asn: 'AS33771',  subnet: '196.201', rdns: '{ip}.safaricom.net',               tz: 'Africa/Nairobi',                      country: 'Kenia',           flag: '🇰🇪' },
    '233': { op: 'MTN Ghana',          asn: 'AS29614',  subnet: '154.160', rdns: '{ip}.mtn.com.gh',                  tz: 'Africa/Accra',                        country: 'Ghana',           flag: '🇬🇭' },
    '20':  { op: 'Mobinil EG',         asn: 'AS24835',  subnet: '41.235',  rdns: '{ip}.mobinil.net',                 tz: 'Africa/Cairo',                        country: 'Egipto',          flag: '🇪🇬' },
    '61':  { op: 'Telstra AU',         asn: 'AS1221',   subnet: '101.160', rdns: '{ip}.tpgi.com.au',                 tz: 'Australia/Sydney',                    country: 'Australia',       flag: '🇦🇺' },
    '64':  { op: 'Spark NZ',           asn: 'AS4771',   subnet: '125.239', rdns: '{ip}.spark.co.nz',                 tz: 'Pacific/Auckland',                    country: 'Nueva Zelanda',   flag: '🇳🇿' },
}

const FAKE_MESSAGES = [
    ['❤️ te extraño mucho bb', 'cuando nos vemos?', 'jajaja eres un loco'],
    ['bro pasame la tarea', 'ya vi el partido, fue una locura', 'oye llámame cuando puedas'],
    ['ya llegué a casa', 'qué vas a hacer hoy?', 'me mandas el número de juan?'],
    ['happy birthday!! 🎂', 'ven a la fiesta el sábado', 'oye vi tu historia jajaj'],
    ['no te creo nada', 'en serio te lo juro', 'bueno ya te cuento después'],
]

// ─── Helpers ─────────────────────────────────────────────────────
function ri(n) { return Math.floor(Math.random() * n) }
function pick(arr) { return arr[ri(arr.length)] }
function pad(n) { return String(n).padStart(2, '0') }

function getRealTime(tz) {
    try {
        return new Date().toLocaleString('en-GB', {
            timeZone: tz,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }) + ` (${tz.split('/').pop().replace(/_/g, ' ')})`
    } catch {
        return `${pad(new Date().getUTCHours())}:${pad(new Date().getUTCMinutes())}:${pad(new Date().getUTCSeconds())} (UTC)`
    }
}

function generateIP(subnet) {
    const parts = subnet.split('.')
    while (parts.length < 4) parts.push(String(ri(253) + 1))
    parts[parts.length - 1] = String(ri(253) + 1)
    return parts.join('.')
}

function generateRdns(template, ip) {
    return template.replace('{ip}', ip.replace(/\./g, '-'))
}

function generateMAC() {
    const first = (ri(127) * 2).toString(16).padStart(2, '0').toUpperCase()
    const rest = [...Array(5)].map(() => ri(256).toString(16).padStart(2, '0').toUpperCase())
    return [first, ...rest].join(':')
}

function detectNetwork(phone) {
    for (const ccLen of [3, 2, 1]) {
        const cc    = phone.slice(0, ccLen)
        const local = phone.slice(ccLen)
        for (const len of [4, 3, 2, 1]) {
            const prefix = local.slice(0, len)
            if (OPERATOR_MAP[prefix]) return OPERATOR_MAP[prefix]
        }
        if (COUNTRY_FALLBACK[cc]) return COUNTRY_FALLBACK[cc]
    }
    return { op: 'Unknown ISP', asn: 'AS0000', subnet: '192.168.1', rdns: '{ip}.unknown.net', tz: 'UTC', country: 'Desconocido', flag: '🌐' }
}

// ─── Handler ─────────────────────────────────────────────────────
let handler = async (m, { conn }) => {
    await m.react('⌛')

    const target    = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    const shortName = '@' + target.split('@')[0]
    const phone     = target.split('@')[0]

    const net      = detectNetwork(phone)
    const fakeIP   = generateIP(net.subnet)
    const rdns     = generateRdns(net.rdns, fakeIP)
    const fakeMAC  = generateMAC()
    const realTime = getRealTime(net.tz)
    const msgs     = pick(FAKE_MESSAGES)

    const { key } = await conn.sendMessage(m.chat, { text: '⏳ Iniciando proceso...' }, { quoted: m })

    const steps = [
        `💻 Iniciando intrusión contra ${shortName}...`,
        `📡 Número detectado: +${phone}`,
        `${net.flag} País identificado: ${net.country}`,
        `📶 Operador: ${net.op}`,
        `🔌 ASN: ${net.asn}`,
        `🌐 Resolviendo IP en subred ${net.subnet}.0/16...`,
        `🔍 Escaneando puertos en ${fakeIP}...`,
        `🔐 Credenciales comprometidas...`,
        `💬 Interceptando mensajes recientes...`,
        `📤 Extrayendo datos...`,
        `🧹 Limpiando rastros...`,
        `✅ Acceso total obtenido`
    ]

    for (let i = 0; i < steps.length; i++) {
        const progress = Math.floor(((i + 1) / steps.length) * 100)
        const filled   = Math.floor(progress / 10)
        const bar      = '▰'.repeat(filled) + '▱'.repeat(10 - filled)
        await conn.sendMessage(m.chat, {
            text: `${steps[i]}\n\n[${bar}] ${progress}%`,
            edit: key
        })
        await new Promise(r => setTimeout(r, 900 + ri(600)))
    }

    const final =
        `☠️ *HACK COMPLETADO — REPORTE FINAL*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Objetivo:* ${shortName}\n` +
        `📱 *Número:* +${phone}\n\n` +
        `🌍 *UBICACIÓN*\n` +
        `• País: ${net.country} ${net.flag}\n` +
        `• Zona horaria: ${net.tz}\n\n` +
        `🌐 *RED*\n` +
        `• Operador: ${net.op}\n` +
        `• Tipo de línea: mobile\n` +
        `• ASN: ${net.asn}\n` +
        `• IP pública: ${fakeIP}\n` +
        `• Hostname: ${rdns}\n` +
        `• MAC: ${fakeMAC}\n\n` +
        `🔑 *ÚLTIMA ACTIVIDAD*\n` +
        `• Hora local del objetivo: ${realTime}\n\n` +
        `💬 *MENSAJES INTERCEPTADOS*\n` +
        msgs.map((msg, i) => `• [${i + 1}] "${msg}"`).join('\n') + '\n\n' +
        `━━━━━━━━━━━━━━━━━━\n` +
        `_Datos extraídos y almacenados correctamente._`

    await conn.sendMessage(m.chat, { text: final, edit: key })
    await m.react('💀')
}

handler.help = ['hack @user']
handler.tags = ['fun']
handler.command = ['hack']
export default handler
