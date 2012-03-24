GET 	/photos 	Photos(controller) 	index(action) 	display a list of all photos
GET 	/photos/new 	Photos 	new 	return an HTML form for creating a new photo
POST 	/photos 	Photos 	create 	create a new photo
GET 	/photos/1 	Photos 	show 	display a specific photo
GET 	/photos/1/edit 	Photos 	edit 	return an HTML form for editing a photo
PUT 	/photos/1 	Photos 	update 	update a specific photo
DELETE 	/photos/1 	Photos 	destroy 	delete a specific photo

-- Testing Razr views
-- Returning content based on content type.. controller returning json instead of html

@helper GetChartData(List<Pepper.ViewModels.Fund.InvestorFundViewModel> investors) {
    decimal totalInvestorCommitment = 0;
    decimal restInvestorCommitment = 0;
    int investorCount = 0;
    System.Text.StringBuilder amtBuilder = new System.Text.StringBuilder();
    System.Text.StringBuilder investorNames = new System.Text.StringBuilder();
    System.Text.StringBuilder restInvestorNames = new System.Text.StringBuilder();
    for(int i =0; i< investors.Count; i++){
        totalInvestorCommitment += investors[i].CommittedAmount;
        if(investorCount >= 10){
            restInvestorCommitment += investors[i].CommittedAmount;
            restInvestorNames.Append(investors[i].InvestorName).Append(",");
        }else {
            amtBuilder.Append(investors[i].CommittedAmount).Append(",");
            investorNames.Append("%%.%% – ").Append(investors[i].InvestorName).Append(",");
        }
        investorCount++;
    }
    
    if(investorCount>=10){
        amtBuilder.Append(restInvestorCommitment).Append(",");
        investorNames.Append("Rest").Append(",");
    }

    string cData = amtBuilder.ToString();
    string invNames = investorNames.ToString();
    if(cData.Length > 0){
        cData = cData.Substring(0, cData.Length - 1);
        invNames = invNames.Substring(0, invNames.Length - 1);
    }
    
    @:pieData = [@cData];
	@:pieLegend = [@invNames];
    //  @:Plain Text is @bar
} 


<script language="javascript">
            $(document).ready(function () {
            alert('Hi');
                /* Title settings */		
	            title = "Investor commitment";
	            titleXpos = 390;
	            titleYpos = 85;

                /* Pie Data */
	            pieRadius = 130;
	            pieXpos = 150;
	            pieYpos = 180;
                @GetChartData(Model)
	            pieLegendPos = "east";

                var r = Raphael("canvas");
                 
                r.g.text(titleXpos, titleYpos, title).attr({"font-size": 20});
                
                var pie = r.g.piechart(pieXpos, pieYpos, pieRadius, pieData, {legend: pieLegend, legendpos: pieLegendPos});
                pie.hover(function () {
                    this.sector.stop();
                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                }, function () {
                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                    if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                    }
                });
            });
        </script>
--------------------------------------------------------------------------------------
@helper GetChartData(List<Pepper.ViewModels.Fund.InvestorFundViewModel> investors) {
    decimal totalInvestorCommitment = 0;
    decimal restInvestorCommitment = 0;
    int investorCount = 0;
    System.Text.StringBuilder amtBuilder = new System.Text.StringBuilder();
    System.Text.StringBuilder investorNames = new System.Text.StringBuilder();
    System.Text.StringBuilder restInvestorNames = new System.Text.StringBuilder();
    for(int i =0; i< investors.Count; i++){
        totalInvestorCommitment += investors[i].CommittedAmount;
        if(investorCount >= 10){
            restInvestorCommitment += investors[i].CommittedAmount;
            restInvestorNames.Append(investors[i].InvestorName).Append(",");
        }else {
            amtBuilder.Append(investors[i].CommittedAmount).Append(",");
            restInvestorNames.Append(investors[i].InvestorName).Append(",");
        }
        investorCount++;
    }
    
    if(investorCount>=10){
        amtBuilder.Append(restInvestorCommitment).Append(",");
        investorNames.Append("Rest").Append(",");
    }

    string cData = amtBuilder.ToString();
    if(cData.Length > 0){
        cData = cData.Substring(0, cData.Length - 1);
    }
    
    
    @cData
    //  @:Plain Text is @bar
}

$(document).ready(function () {
                var paper = Raphael('canvas', 640, 480),
                chartData = [@GetChartData(Model)];

                paper.rect(0, 0, 640, 480).attr('fill', '#fff');
                chart = paper.piechart(320, 240, 100, chartData);
            });       

			-------------------------------------------------------------------------------
			<!-- Investors -->
    <div class="widget">
        <div class="widget_header">
            <div class="widget_header_left">
                <strong><a href="#groups_involvement" onclick="return false;">Investors</a></strong>
            </div>
            <div class="widget_header_right">
                <div class="widget_header_add">
                    <a href="#add_to_group" id="lnk_add_to_group" onclick="IndividualDetail.ToggleAddToGroup();return false;">
                        <img src="https://static.fellowshipone.com/portal/images/icon_plus.png?201226_16-26"
                            alt="Add to group" width="16" height="16" />
                    </a>
                </div>
            </div>
            <div class="clear">
            </div>
        </div>
        <div class="widget_action" id="add_to_group" style="display: none;">
            <div class="box gutter_bottom_none">
                <form action="/people/Individual/Index.aspx?id=8500561&hsd=6280706" id="group_form"
                method="post" onsubmit="AddMemberToGroup(this.id); return false;">
                <input type="hidden" name="XHR_ACTION" value="AddToGroup" />
                <p class="form_element">
                    <label for="ddlGroups">
                        Add to&hellip;</label>
                    <select id="ddlGroupTypes" name="selected_group_type" class="width_half">
                        <option value="0">Choose a group type...</option>
                        <option value=".net hater group">.net hater group </option>
                    </select>
                </p>
                <p class="form_element">
                    <select id="ddlGroups" name="selected_group" class="width_half" disabled="true">
                        <option value="0">Choose a group...</option>
                    </select>
                </p>
                <p>
                    <input type="submit" value="Add to group" disabled="true" id="AddToGroupButton" />
                    <a href="#" onclick="IndividualDetail.ToggleAddToGroup();return false;">Done</a>
                </p>
                <script>
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroupTypes').observe('change', function () { GetGroupsInGroupType('/people/Individual/Index.aspx?id=8500561&hsd=6280706'); });
                    });
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroups').observe('change', function () { $('AddToGroupButton').disabled = !($('ddlGroups').selectedIndex > 0); });
                    });
                </script>
                </form>
            </div>
        </div>
        @Html.Partial("_investors", @Model.Investors)
        <div class="widget_footer">
        </div>
    </div>
    <!-- End Investors -->

     <!-- Capital Calls -->
    <div class="widget">
        <div class="widget_header">
            <div class="widget_header_left">
                <strong><a href="#fund_capitalcalls" onclick="return false;">Capital calls</a></strong>
            </div>
            <div class="widget_header_right">
                <div class="widget_header_add">
                    <a href="#add_capitalcall" id="lnk_add_capitalcall" onclick="IndividualDetail.ToggleAddToGroup();return false;">
                        <img src="https://static.fellowshipone.com/portal/images/icon_plus.png?201226_16-26"
                            alt="Add to group" width="16" height="16" />
                    </a>
                </div>
            </div>
            <div class="clear">
            </div>
        </div>
        <div class="widget_action" id="add_capitalcall" style="display: none;">
            <div class="box gutter_bottom_none">
                <form action="/people/Individual/Index.aspx?id=8500561&hsd=6280706" id="group_form"
                method="post" onsubmit="AddMemberToGroup(this.id); return false;">
                <input type="hidden" name="XHR_ACTION" value="AddToGroup" />
                <p class="form_element">
                    <label for="ddlGroups">
                        Add to&hellip;</label>
                    <select id="ddlGroupTypes" name="selected_group_type" class="width_half">
                        <option value="0">Choose a group type...</option>
                        <option value=".net hater group">.net hater group </option>
                    </select>
                </p>
                <p class="form_element">
                    <select id="ddlGroups" name="selected_group" class="width_half" disabled="true">
                        <option value="0">Choose a group...</option>
                    </select>
                </p>
                <p>
                    <input type="submit" value="Add to group" disabled="true" id="AddToGroupButton" />
                    <a href="#" onclick="IndividualDetail.ToggleAddToGroup();return false;">Done</a>
                </p>
                <script>
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroupTypes').observe('change', function () { GetGroupsInGroupType('/people/Individual/Index.aspx?id=8500561&hsd=6280706'); });
                    });
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroups').observe('change', function () { $('AddToGroupButton').disabled = !($('ddlGroups').selectedIndex > 0); });
                    });
                </script>
                </form>
            </div>
        </div>
        @Html.Partial("_capitalCalls", @Model.CapitalCalls)
        <div class="widget_footer">
        </div>
    </div>
    <!-- End Capital Calls -->

     <!-- Capital Distributions -->
    <div class="widget">
        <div class="widget_header">
            <div class="widget_header_left">
                <strong><a href="#fund_capitaldistribution" onclick="return false;">Capital distributions</a></strong>
            </div>
            <div class="widget_header_right">
                <div class="widget_header_add">
                    <a href="#add_capitaldistribution" id="lnk_add__capitaldistribution" onclick="IndividualDetail.ToggleAddToGroup();return false;">
                        <img src="https://static.fellowshipone.com/portal/images/icon_plus.png?201226_16-26"
                            alt="Add to group" width="16" height="16" />
                    </a>
                </div>
            </div>
            <div class="clear">
            </div>
        </div>
        <div class="widget_action" id="add__capitaldistribution" style="display: none;">
            <div class="box gutter_bottom_none">
                <form action="/people/Individual/Index.aspx?id=8500561&hsd=6280706" id="group_form"
                method="post" onsubmit="AddMemberToGroup(this.id); return false;">
                <input type="hidden" name="XHR_ACTION" value="AddToGroup" />
                <p class="form_element">
                    <label for="ddlGroups">
                        Add to&hellip;</label>
                    <select id="ddlGroupTypes" name="selected_group_type" class="width_half">
                        <option value="0">Choose a group type...</option>
                        <option value=".net hater group">.net hater group </option>
                    </select>
                </p>
                <p class="form_element">
                    <select id="ddlGroups" name="selected_group" class="width_half" disabled="true">
                        <option value="0">Choose a group...</option>
                    </select>
                </p>
                <p>
                    <input type="submit" value="Add to group" disabled="true" id="AddToGroupButton" />
                    <a href="#" onclick="IndividualDetail.ToggleAddToGroup();return false;">Done</a>
                </p>
                <script>
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroupTypes').observe('change', function () { GetGroupsInGroupType('/people/Individual/Index.aspx?id=8500561&hsd=6280706'); });
                    });
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroups').observe('change', function () { $('AddToGroupButton').disabled = !($('ddlGroups').selectedIndex > 0); });
                    });
                </script>
                </form>
            </div>
        </div>
        @Html.Partial("_capitalDistributions", @Model.CapitalDistributions)
        <div class="widget_footer">
        </div>
    </div>
    <!-- End Capital Distributions -->

     <!--Deals -->
    <div class="widget">
        <div class="widget_header">
            <div class="widget_header_left">
                <strong><a href="#fund_deals" onclick="return false;">Deals</a></strong>
            </div>
            <div class="widget_header_right">
                <div class="widget_header_add">
                    <a href="#add_capitaldistribution" id="lnk_add__capitaldistribution" onclick="IndividualDetail.ToggleAddToGroup();return false;">
                        <img src="https://static.fellowshipone.com/portal/images/icon_plus.png?201226_16-26"
                            alt="Add to group" width="16" height="16" />
                    </a>
                </div>
            </div>
            <div class="clear">
            </div>
        </div>
        <div class="widget_action" id="add__deal" style="display: none;">
            <div class="box gutter_bottom_none">
                <form action="/people/Individual/Index.aspx?id=8500561&hsd=6280706" id="group_form"
                method="post" onsubmit="AddMemberToGroup(this.id); return false;">
                <input type="hidden" name="XHR_ACTION" value="AddToGroup" />
                <p class="form_element">
                    <label for="ddlGroups">
                        Add to&hellip;</label>
                    <select id="ddlGroupTypes" name="selected_group_type" class="width_half">
                        <option value="0">Choose a group type...</option>
                        <option value=".net hater group">.net hater group </option>
                    </select>
                </p>
                <p class="form_element">
                    <select id="ddlGroups" name="selected_group" class="width_half" disabled="true">
                        <option value="0">Choose a group...</option>
                    </select>
                </p>
                <p>
                    <input type="submit" value="Add to group" disabled="true" id="AddToGroupButton" />
                    <a href="#" onclick="IndividualDetail.ToggleAddToGroup();return false;">Done</a>
                </p>
                <script>
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroupTypes').observe('change', function () { GetGroupsInGroupType('/people/Individual/Index.aspx?id=8500561&hsd=6280706'); });
                    });
                    Event.observe(document, 'dom:loaded', function () {
                        $('ddlGroups').observe('change', function () { $('AddToGroupButton').disabled = !($('ddlGroups').selectedIndex > 0); });
                    });
                </script>
                </form>
            </div>
        </div>
        @Html.Partial("_deals", @Model.Deals)
        <div class="widget_footer">
        </div>
    </div>
    <!-- Deals -->