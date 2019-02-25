// Libraries
import React, { Component } from 'react';

// Comopnents
import { Desktop } from './Desktop/Desktop.jsx';
import { Program } from './Program/Program.jsx';
import { Taskbar } from './Taskbar/Taskbar.jsx';
import { ProgramCrashError } from './Errors/ProgramCrashError.jsx';

// Assets
import './App.css';
import { PROGRAM_DATA } from './program_data.js';

const PROGRAM_LIMIT = 3;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openPrograms: [],
            programCrashError: false
        }

        this.isProgramOpen = this.isProgramOpen.bind(this);
        this.selectApplication = this.selectApplication.bind(this);
        this.selectProgram = this.selectProgram.bind(this);
        this.closeProgram = this.closeProgram.bind(this);
        this.closeError = this.closeError.bind(this);

        this.renderOpenPrograms = this.renderOpenPrograms.bind(this);
    }

    isProgramOpen(id) {
        const { openPrograms } = this.state;

        return !!openPrograms.find((program) => {
            return program.id === id;
        })
    }

    selectApplication(id) {
        let newOpenPrograms = [...this.state.openPrograms];

        newOpenPrograms.forEach(program => {
            if (id === program.id) {
                program.taskbarButtonSelected = true;
            } else {
                program.taskbarButtonSelected = false;
            }
        });

        this.setState(() => ({
            openPrograms: newOpenPrograms
        }));
    }

    selectProgram(id) {
        const { openPrograms } = this.state;

        if (PROGRAM_LIMIT === openPrograms.length) {
            this.setState(() => {
                return {
                    openPrograms: [],
                    programCrashError: true
                }
            });
        } else {
            const openProgram = PROGRAM_DATA.find(program => {
                return program.id === id;
            });
            
            if (!this.isProgramOpen(id)) {
                this.setState((prevState) => {
                    const newOpenPrograms = [...prevState.openPrograms, openProgram];
                    return {
                        openPrograms: newOpenPrograms
                    }
                }, () => this.selectApplication(id));
            }
        }
    }

    closeProgram(id) {
        this.setState((prevState) => {
            let openProgramId;

            const newOpenPrograms = prevState.openPrograms.reduce((accumulator, program) => {
                if(program.taskbarButtonSelected) {
                    openProgramId = program.id;
                }

                if(program.id !== id) {
                    accumulator.push(program);
                }

                return accumulator;
            }, []);

            // Set a new program to open if the previously open program is now closed
            if(newOpenPrograms[0] && openProgramId === id) {
                newOpenPrograms[0].taskbarButtonSelected = true;
            }

            return {
                openPrograms: newOpenPrograms
            }
        });
    }

    closeError() {
        this.setState(() => ({
            programCrashError: false
        }));
    }

    renderOpenPrograms() {
        const { openPrograms } = this.state;

        return openPrograms.map(openProgram => {
            return (
                <Program key={openProgram.id} program={openProgram} closeProgram={this.closeProgram}/>
            );
        });
    }

    render() {
        const { openPrograms, programCrashError } = this.state;
        return (
            <div className="windows">
                <Desktop icons={PROGRAM_DATA} selectProgram={this.selectProgram}/>
                <Taskbar applications={openPrograms} selectApplication={this.selectApplication} />
                { this.renderOpenPrograms() }
                { programCrashError && <ProgramCrashError closeError={this.closeError}/> }
            </div>
        );
    }
}

export default App;
