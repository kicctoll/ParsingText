# Parsing text

This project allows you to read text from one file and output list of words with list of line numbers where that word is met in another file

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

In order to run this project, you'll need to have .NET Core 2.2 or higher on your local development machine.

### Installing

First of all you'll need to complete following commands:

```bash
git clone https://github.com/Kicctoll/ParsingText.git
cd ParsingText
dotnet restore
```

## Build and run

Inside the newly created project, you can run some built-in commands:1

```bash
dotnet build
dotnet run -p ParsingText/ParsingText.csproj
```

In order to run the web server. Open [http://localhost:5000](http://localhost:5000) or [https://localhost:5001](https://localhost:5001) to view it in the browser.

## Built With

* [ASP.NET Core 2.2](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2) - Web framework to build the REST Api
* [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) - ORM to data access
