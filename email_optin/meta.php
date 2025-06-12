<?php 
    if($_SERVER['SERVER_NAME'] == "preview.wbpsites.com" || $_SERVER['SERVER_NAME'] == 'localhost')
    {
        $path = 'https://preview.wbpsites.com/weaponsmaybrooknews/us/site/email_optin/';
    }else{
        $path = 'https://www.maybrookmissing.com/email_optin/';
    }
	$countryCode = "";
	
    function getUserIP() {
            $userIP =   '';
            if(isset($_SERVER['HTTP_CLIENT_IP'])){
                $userIP =   $_SERVER['HTTP_CLIENT_IP'];
            }elseif(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
                $userIP =   $_SERVER['HTTP_X_FORWARDED_FOR'];
            }elseif(isset($_SERVER['HTTP_X_FORWARDED'])){
                $userIP =   $_SERVER['HTTP_X_FORWARDED'];
            }elseif(isset($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'])){
                $userIP =   $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
            }elseif(isset($_SERVER['HTTP_FORWARDED_FOR'])){
                $userIP =   $_SERVER['HTTP_FORWARDED_FOR'];
            }elseif(isset($_SERVER['HTTP_FORWARDED'])){
                $userIP =   $_SERVER['HTTP_FORWARDED'];
            }elseif(isset($_SERVER['REMOTE_ADDR'])){
                $userIP =   $_SERVER['REMOTE_ADDR'];
            }else{
                $userIP =   'UNKNOWN';
            }
            return $userIP;
    }
        // create & initialize a curl session
        $getIp =  getUserIP();
        
        if($getIp != 'UNKNOWN'){
            $curl_new = curl_init();
            curl_setopt($curl_new, CURLOPT_URL, "https://showtimes.wbpsites.com/api/Ticketing/GetCityDetails?ip_address=".$getIp);
            curl_setopt($curl_new, CURLOPT_RETURNTRANSFER, 1);
            $output_new = curl_exec($curl_new);
            //echo $output_new;
            curl_close($curl_new);
            $getCountry = json_decode($output_new,true);
            //echo $getCountry['CountryIsoCode'];	
           $country = strtoupper($getCountry['CountryIsoCode']);
           $countryCode = $country;
        }
	
	
?>