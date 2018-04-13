$(document).ready(function() {

    if (localStorage['allPeople'] === undefined) {
        localStorage['allPeople'] = '';
    } else {
        allPeopleParsed = JSON.parse(localStorage['allPeople']);
        // Loop over the array addressBook and insert into the page

        for (var n in allPeopleParsed) {
            var newPerson = new Object;
            newPerson.NameSurname = allPeopleParsed[n].NameSurname;
            newPerson.PersonCompany = allPeopleParsed[n].PersonCompany;
            newPerson.PersonPhoneNumber = allPeopleParsed[n].PersonPhoneNumber;
            newPerson.PersonEmail = allPeopleParsed[n].PersonEmail;
            allPeople.push(newPerson);
        }
    }

    displayAllContacts();

    if (localStorage['allCompanies'] === undefined) {
        localStorage['allCompanies'] = '';
    } else {
        allCompaniesParsed = JSON.parse(localStorage['allCompanies']);
        // Loop over the array addressBook and insert into the page

        for (var n in allCompaniesParsed) {
            var newCompany = new Object;
            newCompany.CompanyName = allCompaniesParsed[n].CompanyName;
            newCompany.CompanyPhoneNumber = allCompaniesParsed[n].CompanyPhoneNumber;
            newCompany.CompanyEmail = allCompaniesParsed[n].CompanyEmail;
            newCompany.CompanyAddress = allCompaniesParsed[n].CompanyAddress;
            allCompanies.push(newCompany);
            newCompanytab(newCompany.CompanyName);
        }
    }

    $("#AllContactsFilter").trigger("click");

});

var allCompanies = [];
var allPeople = [];
var nextTabPanelId = 1000001;
var lastTabSelected = $("#AllContactsFilter");
var lastCompanySelected = "";
var lastPersonEdited = "";

function getFormCompany() {
    var inputs = $('#companyForm').serializeArray();
    var company = new Object();

    $.each(inputs, function(i, input) {
        company[input.name] = input.value;
    });

    return company;
}

function getEditFormCompany() {
    var inputs = $('#companyEditForm').serializeArray();
    var company = new Object();

    $.each(inputs, function(i, input) {
        company[input.name] = input.value;
    });

    return company;
}

function newCompanytab(company) {
    $("#tabs").append('<li class="nav-item tab"> <a class="nav-link" href="#panel-' + nextTabPanelId + '" data-toggle="tab" onclick="changeFilter(this)"> ' + company + '</a></li>');
    $("#tabContent").append('<div class="tab-pane" id="panel-' + nextTabPanelId + '"> </div>');
    nextTabPanelId++;
}

$("#submitCompany").click(function() {

    if ($('#CompanyName').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter the name of the Company");
    } else if ($('#CompanyPhoneNumber').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter a phone number");
    } else if ($('#CompanyEmail').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter an email address");
    } else if ($('#CompanyAddress').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter the address of the company");
    } else {
        $("#submitCompany").attr("data-dismiss", "modal");

        var newCompany = getFormCompany();

        if (!validateEmail(newCompany.CompanyEmail)) {
            $("#submitCompany").removeAttr("data-dismiss");
            alert("Please enter a valid email address");
        } else if (!validatePhoneNumber(newCompany.CompanyPhoneNumber)) {
            $("#submitCompany").removeAttr("data-dismiss");
            alert("Please enter a valid phone number");
        } else {

            var companyAlreadyExists = false;

            for (var i = 0; i < allCompanies.length; i ++){
                if (allCompanies[i].CompanyName == newCompany.CompanyName){
                    companyAlreadyExists = true;
                    break;
                }
            }

            if (!companyAlreadyExists){
                allCompanies.push(newCompany);
                localStorage['allCompanies'] = JSON.stringify(allCompanies);
                newCompanytab(newCompany.CompanyName);
                $('#companyForm').trigger("reset");
            }
            else{
                $('#companyForm').trigger("reset");
                alert("This company has already been added to the address book");
            }
        }
    }
});

function changeFilter(companyObject) {
    var nameOfTheFilterCompany = companyObject.innerText;
    $("#filterName").html(nameOfTheFilterCompany);

    if (nameOfTheFilterCompany != "All Contacts") {
        var n = allCompanies.length;
        var filterCompany = new Object();
        for (var i = 0; i < n; i++) {
            if (allCompanies[i].CompanyName == (nameOfTheFilterCompany)) {
                filterCompany = allCompanies[i];
                break;
            }
        }
        lastTabSelected = companyObject;
        lastCompanySelected = filterCompany.CompanyName;
        $("#filterInfo").html(filterCompany.CompanyAddress + " <br> " + filterCompany.CompanyEmail + " <br> " + filterCompany.CompanyPhoneNumber);
        $("#companyButtons").show();
        sortByCompanies(filterCompany.CompanyName);
    } else {
        $("#filterInfo").html("<br>");
        $("#companyButtons").hide();
        displayAllContacts();
        lastTabSelected = $("#AllContactsFilter");
    }


}

function getFormPerson() {
    var inputs = $('#personForm').serializeArray();
    var person = new Object();

    $.each(inputs, function(i, input) {
        person[input.name] = input.value;
    });

    return person;
}

function getEditFormPerson() {
    var inputs = $('#personFormEdit').serializeArray();
    var person = new Object();

    $.each(inputs, function(i, input) {
        person[input.name] = input.value;
    });

    return person;
}

$("#submitPerson").click(function() {
    if ($('#NameSurname').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter the name of the person");
    } else if ($('#PersonCompany').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter a company the person works in");
    } else if ($('#PersonPhoneNumber').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter a phone number");
    } else if ($('#PersonEmail').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter an email address");
    } else {
        $("#submitPerson").attr("data-dismiss", "modal");
        var newPerson = getFormPerson();

        if (!validateEmail(newPerson.PersonEmail)) {
            $("#submitPerson").removeAttr("data-dismiss");
            alert("Please enter a valid email address");
        } else if (!validatePhoneNumber(newPerson.PersonPhoneNumber)) {
            $("#submitPerson").removeAttr("data-dismiss");
            alert("Please enter a valid phone number");
        } else {
            allPeople.push(newPerson);
            localStorage['allPeople'] = JSON.stringify(allPeople);
            $("#AllContactsFilter").trigger("click");
            displayAllContacts();
            $('#personForm').trigger("reset");
        }
    }
});

function displayAllContacts() {
    $("#contactTableBody").find("tr").remove();
    var m = allPeople.length;
    var tempPerson = new Object();
    for (var i = 0; i < m; i++) {
        tempPerson = allPeople[i];

        var phoneNumber = tempPerson.PersonPhoneNumber;
        phoneNumber = phoneNumber.replace(/\s/g, '');

        $("#contactTableBody").append('<tr> <td> ' + tempPerson.PersonCompany + ' </td> <td> ' + tempPerson.NameSurname + ' </td> <td>' +
            tempPerson.PersonPhoneNumber + ' </td> <td> ' + tempPerson.PersonEmail + ' </td> <th> <button type="button" class="btn btn btn-warning editPerson" data-toggle="modal" data-target="#myModal-personEdit" id = ' + phoneNumber + ' onclick = "editPerson(this)" >Edit...</button>    <button type="button" class="btn btn btn-danger" id = ' + phoneNumber + ' onclick = "deletePerson(this)" >Delete</button></th> </tr>');
    }
};

function sortByCompanies(company) {
    $("#contactTableBody").find("tr").remove();
    var k = allPeople.length;
    var tempPerson = new Object();
    for (var i = 0; i < k; i++) {
        if (allPeople[i].PersonCompany == (company)) {
            tempPerson = allPeople[i];

            var phoneNumber = tempPerson.PersonPhoneNumber;
            phoneNumber = phoneNumber.replace(/\s/g, '');

            $("#contactTableBody").append('<tr> <td> ' + tempPerson.PersonCompany + ' </td> <td> ' + tempPerson.NameSurname + ' </td> <td>' +
                tempPerson.PersonPhoneNumber + ' </td> <td> ' + tempPerson.PersonEmail + ' </td> <th> <button type="button" class="btn btn btn-warning editPerson" data-toggle="modal" data-target="#myModal-personEdit" id = ' + phoneNumber + ' onclick = "editPerson(this)" >Edit...</button>    <button type="button" class="btn btn btn-danger" id = ' + phoneNumber + ' onclick = "deletePerson(this)" >Delete</button></th> </tr>');
        }
    }
}

function deleteCompany() {
    var lastT = lastTabSelected;
    var lastC = lastCompanySelected;

    $("#AllContactsFilter").trigger("click");
    lastT.remove();

    var p = allCompanies.length;
    var index;

    for (var i = 0; i < p; i++) {
        if (allCompanies[i].CompanyName == (lastC)) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        allCompanies.splice(index, 1);
    }

    localStorage['allCompanies'] = JSON.stringify(allCompanies);
}

$("#editCompany").click(function() {
    var p = allCompanies.length;
    var filterCompany = new Object();

    for (var i = 0; i < p; i++) {
        if (allCompanies[i].CompanyName == (lastCompanySelected)) {
            filterCompany = allCompanies[i];
            break;
        }
    }
    $('#CompanyPhoneNumberEdit').val(filterCompany.CompanyPhoneNumber);
    $('#CompanyEmailEdit').val(filterCompany.CompanyEmail);
    $('#CompanyAddressEdit').val(filterCompany.CompanyAddress);
});

function saveNewCompanyDetails() {
    if ($('#CompanyPhoneNumberEdit').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter a phone number");
    } else if ($('#CompanyEmailEdit').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter an email address");
    } else if ($('#CompanyAddressEdit').val().length < 1) {
        $("#submitCompany").removeAttr("data-dismiss");
        alert("Please enter the address of the company");
    } else {
        $("#submitCompany").removeAttr("data-dismiss");
        var p = allCompanies.length;
        var filterCompany = new Object();

        for (var i = 0; i < p; i++) {
            if (allCompanies[i].CompanyName == (lastCompanySelected)) {
                filterCompany = allCompanies[i];
                break;
            }
        }

        var newCompanyData = getEditFormCompany();

        if (!validateEmail(newCompanyData.CompanyEmail)) {
            alert("Please enter a valid email address");
        } else if (!validatePhoneNumber(newCompanyData.CompanyPhoneNumber)) {
            alert("Please enter a valid phone number");
        } else {
            $("#CompanyModalEditSave").attr("data-dismiss", "modal");
            $("#filterInfo").html(newCompanyData.CompanyAddress + " <br> " + newCompanyData.CompanyEmail + " <br> " + newCompanyData.CompanyPhoneNumber);
            filterCompany.CompanyPhoneNumber = newCompanyData.CompanyPhoneNumber;
            filterCompany.CompanyEmail = newCompanyData.CompanyEmail;
            filterCompany.CompanyAddress = newCompanyData.CompanyAddress;
            localStorage['allCompanies'] = JSON.stringify(allCompanies);
        }
    }
};

function deletePerson(button) {
    var nameToBeDeleted = "";
    personPhoneToBeDeleted = button.id;

    var r = allPeople.length;
    var index;

    for (var i = 0; i < r; i++) {

        var phoneNumber = allPeople[i].PersonPhoneNumber;
        phoneNumber = phoneNumber.replace(/\s/g, '');

        if (phoneNumber == (personPhoneToBeDeleted)) {
            index = i;

            break;
        }
    }

    if (index >= 0) {
        allPeople.splice(index, 1);
    }

    button.closest('tr').remove();

    localStorage['allPeople'] = JSON.stringify(allPeople);
}

function editPerson(buttonSelected) {
    var t = allPeople.length;
    var filterPerson = new Object();
    var phoneOfPersonChanged = buttonSelected.id;
    lastPersonEdited = phoneOfPersonChanged;

    for (var i = 0; i < t; i++) {
        var phoneNumber = allPeople[i].PersonPhoneNumber;
        phoneNumber = phoneNumber.replace(/\s/g, '');

        if (phoneNumber == (phoneOfPersonChanged)) {
            filterPerson = allPeople[i];
            break;
        }
    }

    $('#PersonCompanyEdit').val(filterPerson.PersonCompany);
    $('#PersonPhoneNumberEdit').val(filterPerson.PersonPhoneNumber);
    $('#PersonEmailEdit').val(filterPerson.PersonEmail);
}

function saveNewPersonDetails() {
    if ($('#PersonCompanyEdit').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter a company name");
    } else if ($('#PersonPhoneNumberEdit').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter a phone number");
    } else if ($('#PersonEmailEdit').val().length < 1) {
        $("#submitPerson").removeAttr("data-dismiss");
        alert("Please enter an email address");
    } else {
        var p = allPeople.length;
        var filterPerson = new Object();

        for (var i = 0; i < p; i++) {
            var phoneNumber = allPeople[i].PersonPhoneNumber;
            phoneNumber = phoneNumber.replace(/\s/g, '');

            if (phoneNumber == (lastPersonEdited)) {
                filterPerson = allPeople[i];
                break;
            }
        }

        var newPersonData = getEditFormPerson();

        if (!validateEmail(newPersonData.PersonEmail)) {
            $("#submitPerson").removeAttr("data-dismiss");
            alert("Please enter a valid email address");
        } else if (!validatePhoneNumber(newPersonData.PersonPhoneNumber)) {
            $("#submitPerson").removeAttr("data-dismiss");
            alert("Please enter a valid phone number");
        } else {
            $("#PersonModalEditSave").attr("data-dismiss", "modal");
            filterPerson.PersonCompany = newPersonData.PersonCompany;
            filterPerson.PersonPhoneNumber = newPersonData.PersonPhoneNumber;
            filterPerson.PersonEmail = newPersonData.PersonEmail;
            localStorage['allPeople'] = JSON.stringify(allPeople);

            $(lastTabSelected).trigger("click");
        }

    }
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phoneNumber) {
    var re = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/;
    return re.test(String(phoneNumber).toLowerCase());
}
