<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PlayerSeeder extends Seeder
{
    public function run(): void
    {
        $players = [

            // ===== GROUP 1 =====
            ['id_am' => '130614F04', 'first_name' => 'Fatiha', 'last_name' => 'Karma', 'date_of_birth' => '2004-11-12'],
            ['id_am' => '049842F02', 'first_name' => 'Khaoula', 'last_name' => 'Kerchoub', 'date_of_birth' => '2002-08-08'],
            ['id_am' => '259915F89', 'first_name' => 'Zahira', 'last_name' => 'Najrane', 'date_of_birth' => '1989-01-03'],
            ['id_am' => '132946F06', 'first_name' => 'Meriem', 'last_name' => 'Oumzane', 'date_of_birth' => '2006-12-18'],
            ['id_am' => '044716F00', 'first_name' => 'Hasna', 'last_name' => 'Rabeh', 'date_of_birth' => '2000-06-12'],
            ['id_am' => '047334F09', 'first_name' => 'Aya', 'last_name' => 'Arzayane', 'date_of_birth' => '2009-11-05'],

            // ===== GROUP 2 =====
            ['id_am' => '133856F09', 'first_name' => 'Noura', 'last_name' => 'Ammar', 'date_of_birth' => '2009-11-20'],
            ['id_am' => '223807F10', 'first_name' => 'Rania', 'last_name' => 'Aslam', 'date_of_birth' => '2010-07-24'],
            ['id_am' => '200358F09', 'first_name' => 'Aya', 'last_name' => 'Atfy', 'date_of_birth' => '2009-07-09'],
            ['id_am' => '133337F10', 'first_name' => 'Khadija', 'last_name' => 'Badr', 'date_of_birth' => '2010-12-07'],
            ['id_am' => '272007F09', 'first_name' => 'Salima', 'last_name' => 'Chibani', 'date_of_birth' => '2009-08-31'],
            ['id_am' => '047407F10', 'first_name' => 'Roumaissae', 'last_name' => 'Chrachem', 'date_of_birth' => '2010-01-20'],
            ['id_am' => '132628F10', 'first_name' => 'Niama', 'last_name' => 'Eddellsy', 'date_of_birth' => '2010-05-18'],
            ['id_am' => '202021F10', 'first_name' => 'Lamiaa', 'last_name' => 'El Ghaouch', 'date_of_birth' => '2010-11-11'],
            ['id_am' => '053881F09', 'first_name' => 'Khadija', 'last_name' => 'El Ghourraf', 'date_of_birth' => '2009-05-22'],
            ['id_am' => '047400F10', 'first_name' => 'Douae', 'last_name' => 'El Hajibi', 'date_of_birth' => '2010-05-28'],
            ['id_am' => '047337M09', 'first_name' => 'Fatima Zahra', 'last_name' => 'El Hatimy', 'date_of_birth' => '2009-12-30'],
            ['id_am' => '047396F10', 'first_name' => 'Racha', 'last_name' => 'El Ibrahimi', 'date_of_birth' => '2010-03-18'],
            ['id_am' => '240685F09', 'first_name' => 'Karima', 'last_name' => 'Madadi', 'date_of_birth' => '2009-07-05'],
            ['id_am' => '133338F10', 'first_name' => 'Salma', 'last_name' => 'Jnah', 'date_of_birth' => '2010-09-16'],
            ['id_am' => '136666F10', 'first_name' => 'Khadija', 'last_name' => 'Khayat', 'date_of_birth' => '2010-11-11'],
            ['id_am' => '200359F09', 'first_name' => 'Wafae', 'last_name' => 'Soufi', 'date_of_birth' => '2009-10-19'],
            ['id_am' => '056647F09', 'first_name' => 'Janat', 'last_name' => 'Nasir', 'date_of_birth' => '2009-04-14'],
            ['id_am' => '201085F09', 'first_name' => 'Malak', 'last_name' => 'Sabire', 'date_of_birth' => '2009-06-06'],

            // ===== GROUP 3 =====
            ['id_am' => '202023M13', 'first_name' => 'Ihsane', 'last_name' => 'Arias', 'date_of_birth' => '2013-04-23'],
            ['id_am' => '047398F12', 'first_name' => 'Zineb', 'last_name' => 'Ayab', 'date_of_birth' => '2012-12-03'],
            ['id_am' => '200351F15', 'first_name' => 'Ghofrane', 'last_name' => 'Bartal', 'date_of_birth' => '2015-06-18'],
            ['id_am' => '132625F12', 'first_name' => 'Majdouline', 'last_name' => 'El Hamdaoui', 'date_of_birth' => '2012-01-22'],
            ['id_am' => '272008F11', 'first_name' => 'Youssra', 'last_name' => 'El Herbazi', 'date_of_birth' => '2011-10-06'],
            ['id_am' => '133350F11', 'first_name' => 'Amina', 'last_name' => 'El Isamy', 'date_of_birth' => '2011-01-05'],
            ['id_am' => '235835F11', 'first_name' => 'Amina', 'last_name' => 'Hilal', 'date_of_birth' => '2011-12-06'],
            ['id_am' => '080954F11', 'first_name' => 'Yasmine', 'last_name' => 'Mifdal', 'date_of_birth' => '2011-03-17'],
            ['id_am' => '200349F12', 'first_name' => 'Khnata', 'last_name' => 'Moukaby', 'date_of_birth' => '2012-03-20'],
            ['id_am' => '133771F11', 'first_name' => 'Jannat', 'last_name' => 'Moukid', 'date_of_birth' => '2011-12-12'],
            ['id_am' => '133342F12', 'first_name' => 'Salma', 'last_name' => 'Otmane', 'date_of_birth' => '2012-01-22'],
            ['id_am' => '272006F13', 'first_name' => 'Fatima', 'last_name' => 'Ezzahrae Ouakkal', 'date_of_birth' => '2013-01-23'],
            ['id_am' => '200350F13', 'first_name' => 'Majid', 'last_name' => 'Salima', 'date_of_birth' => '2013-11-21'],
            ['id_am' => '133849F12', 'first_name' => 'Ranya', 'last_name' => 'Salym', 'date_of_birth' => '2012-11-23'],
            ['id_am' => '133341F11', 'first_name' => 'Yassmine', 'last_name' => 'Es-Seddyk y', 'date_of_birth' => '2011-12-11'],
            ['id_am' => '272005F15', 'first_name' => 'Jannat', 'last_name' => 'Essalehy', 'date_of_birth' => '2015-11-30'],
            ['id_am' => '133339M15', 'first_name' => 'Marwa', 'last_name' => 'Hanine', 'date_of_birth' => '2015-03-13'],
            ['id_am' => '092306F12', 'first_name' => 'Inas', 'last_name' => 'Zinoun', 'date_of_birth' => '2012-08-20'],
        ];

        foreach ($players as $player) {
            DB::table('players')->insert([
                'id' => Str::uuid(),
                'id_am' => $player['id_am'],
                'first_name' => $player['first_name'],
                'last_name' => $player['last_name'],
                'date_of_birth' => $player['date_of_birth'],
                'position' => null,
                'preferred_foot' => null,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
