# Vite blade templates

This project is aimed to "simulate" [Laravel blade](https://laravel.com/docs/10.x/blade) html partials / components in node environment.

Basically replaces all `<x-foobar></x-foobar>` with contents of foobar.blade.php


# To use

Copy vite.config.js to your vite project. It listens for changes to src/**.blade.php files, and replaces index.html tags beginning x-
