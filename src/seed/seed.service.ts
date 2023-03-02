import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  //insercion a la base de datos
  constructor(    @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});//esto es igual a delete * from  pokemon;

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // eslint-disable-next-line prettier/prettier
    const pokemonToInsert :{name:string,no:number} [] = []

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no }); //[{name: bulbasaur,no:1}]
   
  });
    this.pokemonModel.insertMany(pokemonToInsert)
    return "seed executed"
 }
}
