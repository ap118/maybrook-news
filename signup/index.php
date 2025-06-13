<?php include('meta.php'); ?>
<html>
<head>
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <link href="../cursor/cursor-style.css" rel="stylesheet">
        <script src="js/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="fixed_form_container">
        <h2>SIGN UP FOR UPDATES!</h2>
        <form action="https://cl.s6.exct.net/DEManager.aspx" name="subscribeForm" method="post">
            
            <?php if($_SERVER['SERVER_NAME'] == "preview.wbpsites.com" || $_SERVER['SERVER_NAME'] == 'localhost'){?>
                <input type="hidden" name="_clientID" value="6379182" />
                <input type="hidden" name="_deExternalKey" value="DB28A023-F032-4668-A59F-86EBCB2291F9" /> <!-- Test DE: GDPR_WarnerBros_Website_Registration -->
            <?php }else{ ?>
                <input type="hidden" name="_clientID" value="6379182" />
                <input type="hidden" name="_deExternalKey" value="GDPR_WarnerBros_Website_Registration" /> <!-- Test DE: GDPR_WarnerBros_Website_Registration -->
            <?php } ?>
                <input type="hidden" name="_action" value="add" />
                <input type="hidden" name="_returnXML" value="0" />
                <input type="hidden" name="_successURL" value="<?php echo $path; ?>thankyou.php" />
                <input type="hidden" name="_errorURL" value="<?php echo $path; ?>error.php" />
            
            <!-- User inputs -->
            <div class="form-group">
            <label for="EmailAddress" class="fixed_form_lable">Email Address<span class="required">*</span></label>
            <input type="EmailAddress" id="EmailAddress" name="EmailAddress" required class="form-control" maxlength="80" oninvalid="this.setCustomValidity('Please enter valid email address')" oninput="this.setCustomValidity('')" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="example@example.com"/></div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="First_Name" class="fixed_form_lable">First Name</label>
                        <input type="text" name="First_Name" class="form-control">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="Last_Name" class="fixed_form_lable">Last Name</label>
                        <input type="text" name="Last_Name" class="form-control">
                     </div>
                </div>

            <!-- Below are the default values for non-nullable fields. You may leave it as is -->
            <input type="hidden" name="IDENTIFIER_TYPE" value="Email" />
            <input type="hidden" name="CONSENTED_BUSINESS_ENTITY" value="Warner Bros. Entertainment Inc." />
            <input type="hidden" name="WB_IP_PROPERTY_NAME" value="Weapons" />
            <input type="hidden" name="CHILDREN_PROPERTY" value="N" />
            <input type="hidden" name="CONSENT_MEDIA_CHANNEL" value="Website" />
            <input type="hidden" name="EXPRESS_CONSENT_INDICATOR_FLAG" value="Y" />
            <input type="hidden" name="DATA_PRIVACY_POLICY_ACK" value="Y" />
            <input type="hidden" name="DATA_PRIVACY_POLICY_ACK_LANGUAGE" value="By clicking on the Subscribe button below, I agree to the Terms of Service and I acknowledge that I have read and understand the Privacy Policy." />
            <input type="hidden" name="DATA_PRIVACY_POLICY_URL" value="https://policies.warnerbros.com/privacy/en-us" />
            <input type="hidden" name="TERMS_OF_USE_ACK" value="Y" />
            <input type="hidden" name="TERMS_OF_USE_ACK_LANGUAGE" value="By clicking on the Subscribe button below, I agree to the Terms of Service and I acknowledge that I have read and understand the Privacy Policy." />
            <input type="hidden" name="TERMS_OF_USE_URL" value="https://www.warnerbros.com/terms" />
            <input type="hidden" name="MARKETING_NEWSLETTER_NAME" value="Microsite Signup" /> <!-- 'Microsite Signup' is just a placeholder here. change it if needed -->
            <input type="hidden" name="MARKETING_OPT_IN_FLAG" value="Y" />


            <!-- Below are fields that need dynamic values -->
            <input type="hidden" name="WEBSITE_SOURCE_URL" value="maybrookmissing.com" /> <!-- movie's site url -->
            <input type="hidden" id="INDIVIDUAL_IDENTIFIER" name="INDIVIDUAL_IDENTIFIER" value="EMAILGOESHERE" /> <!-- this should be user's EmailAddress -->
            <input type="hidden" name="CONSENT_GEO_LOCATION_COUNTRY" value="<?php echo $countryCode; ?>" /> <!-- can this be inferred somehow without asking the user? -->
            <input type="hidden" name="CONSUMER_COUNTRY" value="<?php echo $countryCode; ?>" /> <!-- can this be inferred somehow without asking the user? -->
            <input type="hidden" name="Genres" value="Witch Horror, Horror, Mystery, Thriller" /> <!-- this value will be specific per movie title -->
            <input type="hidden" name="Gender" value="" /> <!-- Male/Female. null value if cannot be inferred without asking the user -->
                <div class="form-group">
                    <div class="checkbox">  
                        <label for="AFFILIATED_PARTNER_CONSENT_FLAG">
                        <input id="AFFILIATED_PARTNER_CONSENT_FLAG" type="checkbox" style="width:12px;opacity:.9;margin-top:4px;height:12px;" name="AFFILIATED_PARTNER_CONSENT_FLAG" value="Y" checked />
                        <input type="hidden" name="AFFILIATED_PARTNER_CONSENT_FLAG" value="N" disabled />
                        <input type="hidden" name="AFFILIATED_PARTNER_CONSENT_LANGUAGE" value="Yes! Warner Bros. Entertainment Inc. may also share my details with Warner Bros. Discovery affiliates so they may send me tailored email and other offers. Warner Bros. Entertainment Inc. is requesting this consent on behalf of its affiliates, which will use the information under their respective privacy policies." />
                        <script>
                            var checkBox = document.getElementById("AFFILIATED_PARTNER_CONSENT_FLAG");
                            var hiddenInput_flag = document.querySelector('input[name="AFFILIATED_PARTNER_CONSENT_FLAG"][type="hidden"]');
                            var hiddenInput_language = document.querySelector('input[name="AFFILIATED_PARTNER_CONSENT_LANGUAGE"][type="hidden"]');

                            checkBox.addEventListener('change', function() {
                                if (this.checked) {
                                    hiddenInput_flag.disabled = true;
                                    hiddenInput_language.disabled = false;
                                } else {
                                    hiddenInput_flag.disabled = false;
                                    hiddenInput_language.disabled = true;
                                }
                            });
                        </script>
                            By entering your email address, you agree to our <a href="https://policies.warnerbros.com/terms/en-us/html/terms_en-us_1.3.0.html" style="text-decoration: underline; font-weight: 600" target="_blank">Terms of Use </a> and acknowledge the <a href="https://policies.warnerbros.com/privacy/en-us/" style="text-decoration: underline; font-weight: 600" target="_blank">Privacy Policy</a>. Warner Bros. Discovery and <a href="https://www.warnermediaprivacy.com/policycenter/b2c/affiliateslist/" style="text-decoration: underline; font-weight: 600" target="_blank">its affiliates</a> may use your email address to provide updates, ads, and offers.<p class="note">To withdraw your consent or learn more about your rights, see the <a href="https://policies.warnerbros.com/privacy/en-us/" style="text-decoration: underline; font-weight: 600" target="_blank">Privacy Policy</a>.</p>
                        </label>
                        <input type="hidden" name="AFFILIATED_PARTNER_URL" value="https://www.warnermediaprivacy.com/policycenter/b2c/affiliateslist/#affiliates" />
                        <input type="hidden" name="MARKETING_SIGN_UP_LANGUAGE" value="Yes! Warner Bros. Entertainment Inc. may use my email address along with my interests and device data to send me tailored email and other offers through social media or other sites and apps" />
                    </div>
                </div>
                <div class="form-group submit-container col-md-12"> 
                    <input type="submit" value="Submit" class="submit-btn">
                </div>
        </form>
    </div>
    <script>
		  var uemailValue = document.getElementById('EmailAddress');
		  var individual_identifier = document.getElementById('INDIVIDUAL_IDENTIFIER');
		  		  
		 $('input[name=EmailAddress]').change(function() {
				 if (uemailValue.value.match(/^([a-zA-Z0-9_\.\%+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
		            individual_identifier.value = uemailValue.value;
                }else{
                    alert("Please enter correct email ID!!!");
                }
            });


 </script>
</body>